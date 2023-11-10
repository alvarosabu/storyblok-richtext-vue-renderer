/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Component, RendererElement, RendererNode, VNode } from 'vue'
import { createTextVNode, getCurrentInstance, h, resolveDynamicComponent } from 'vue'
import SbRichText from './components/SbRichText.vue'

export enum BlockTypes {
  DOCUMENT = 'doc',
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  QUOTE = 'blockquote',
  OL_LIST = 'ordered_list',
  UL_LIST = 'bullet_list',
  LIST_ITEM = 'list_item',
  CODE_BLOCK = 'code_block',
  HR = 'horizontal_rule',
  BR = 'hard_break',
  IMAGE = 'image',
  EMOJI = 'emoji',
  COMPONENT = 'blok',
}

export enum MarkTypes {
  BOLD = 'bold',
  STRONG = 'strong',
  STRIKE = 'strike',
  UNDERLINE = 'underline',
  ITALIC = 'italic',
  CODE = 'code',
  LINK = 'link',
  ANCHOR = 'anchor',
  STYLED = 'styled',
  SUPERSCRIPT = 'superscript',
  SUBSCRIPT = 'subscript',
  TEXT_STYLE = 'textStyle',
  HIGHLIGHT = 'highlight',
}

export enum TextTypes {
  TEXT = 'text',
}

export enum ComponentTypes {
  COMPONENT = 'blok',
}

export enum LinkTargets {
  SELF = '_self',
  BLANK = '_blank',
}

export enum LinkTypes {
  URL = 'url',
  STORY = 'story',
  ASSET = 'asset',
  EMAIL = 'email',
}

export type NodeTypes = BlockTypes | MarkTypes | TextTypes | ComponentTypes

export interface Node {
  type: NodeTypes
  content: Node[]
  children?: VNode[]
  attrs?: Record<string, any>
  text?: string
}

export interface MarkNode extends Node {
  // eslint-disable-next-line max-len
  type: MarkTypes.BOLD | MarkTypes.ITALIC | MarkTypes.UNDERLINE | MarkTypes.STRIKE | MarkTypes.CODE | MarkTypes.LINK | MarkTypes.ANCHOR | MarkTypes.STYLED | MarkTypes.SUPERSCRIPT | MarkTypes.SUBSCRIPT | MarkTypes.TEXT_STYLE | MarkTypes.HIGHLIGHT
  attrs?: Record<string, any>
}

export interface TextNode extends Node {
  type: TextTypes.TEXT
  text: string
  marks?: MarkNode[]
}
export type RenderedNode = ReturnType<typeof h>
export type NodeResolver = (node: Node | TextNode | MarkNode) => VNode<RendererNode, RendererElement, {
  [key: string]: any
}>

export interface SbRichtextOptions {
  resolvers?: Array<[NodeTypes, NodeResolver]>
}
export function useSbRichtext(options: SbRichtextOptions = {
  resolvers: [],
}) {
  const { resolvers = {} } = options
  const components = getCurrentInstance()?.appContext.components

  const nodeResolver = (tag: string): NodeResolver => 
    ({ children, attrs }) => h(tag, attrs, children)

  // @ts-expect-error
  const textResolver: NodeResolver = ({ marks, ...node }) => {
    if ('text' in node) {
      // Now TypeScript knows that 'node' is a TextNode, so 'marks' can be accessed
      return marks ? marks.reduce(
        (text: string, mark: MarkNode) => render({ ...mark, text }),
        render(node),
      ) : createTextVNode(node.text)
    }
  }

  const headingResolver: NodeResolver = ({ children, attrs }) => h(`h${attrs?.level}`, attrs, children)

  const markResolver = (tag: string): NodeResolver => ({ text, attrs }) => h(tag, attrs, text)

  const componentResolver: NodeResolver = ({ attrs, children }) => {
    const { component, file, _preview, preview, _editable, ...rest } = attrs?.body[0]
    return components ? h(components[attrs?.body[0].component], {
      id: attrs?.id,
      blok: rest,
    }, children) : h('div', {}, children)
  }

  const linkResolver: NodeResolver = ({ text, attrs }) => {
    let href = ''

    switch (attrs?.linktype) {
      case LinkTypes.ASSET:
      case LinkTypes.URL:
        href = attrs?.href
        break
      case LinkTypes.EMAIL:
        href = `mailto:${attrs?.href}`
        break
      case LinkTypes.STORY: {
        const RouterLink = resolveDynamicComponent('RouterLink') as Component
        if (!RouterLink) return h('a', { href, target: attrs?.target }, text)

        return h(
          RouterLink,
          { to: attrs?.href, target: attrs?.target },
          { default: () => text },
        )
      }
    }

    return h('a', { href: attrs?.href, target: attrs?.target }, text)
  }
  
  const mergedResolvers = new Map<NodeTypes, NodeResolver>([
    [BlockTypes.DOCUMENT, ({ children }) => h('div', {}, children)],
    [BlockTypes.PARAGRAPH, nodeResolver('p')],
    [BlockTypes.HEADING, headingResolver],
    [BlockTypes.QUOTE, nodeResolver('blockquote')],
    [BlockTypes.UL_LIST, nodeResolver('ul')],
    [BlockTypes.OL_LIST, nodeResolver('ol')],
    [BlockTypes.LIST_ITEM, nodeResolver('li')],
    [BlockTypes.IMAGE, ({ attrs }) => h('img', attrs)],
    [BlockTypes.EMOJI, ({ attrs }) => h('span', attrs)],
    [BlockTypes.CODE_BLOCK, ({ attrs, content }) => h('pre', attrs, [h('code', {}, content[0].text)])],
    [BlockTypes.HR, nodeResolver('hr')],
    [BlockTypes.BR, nodeResolver('br')],
    [TextTypes.TEXT, textResolver],
    [MarkTypes.BOLD, markResolver('strong')],
    [MarkTypes.ITALIC, markResolver('em')],
    [MarkTypes.UNDERLINE, markResolver('u')],
    [MarkTypes.STRIKE, markResolver('s')],
    [MarkTypes.CODE, markResolver('code')],
    [MarkTypes.LINK, linkResolver],
    [MarkTypes.ANCHOR, ({ attrs = {}, children }) => h('a', { id: attrs.id }, children)],
    [MarkTypes.STYLED, ({ attrs = {}, children }) => h(attrs.style, {}, children)],
    [MarkTypes.SUPERSCRIPT, markResolver('sup')],
    [MarkTypes.SUBSCRIPT, markResolver('sub')],
    [MarkTypes.TEXT_STYLE, ({ attrs = {}, children }) => h('span', { style: attrs.style }, children)],
    [MarkTypes.HIGHLIGHT, markResolver('mark')],
    [ComponentTypes.COMPONENT, componentResolver],
    // eslint-disable-next-line max-len
    ...(Object.entries(resolvers).map(([type, resolver]) => [type as NodeTypes, resolver])) as Array<[NodeTypes, NodeResolver]>,
  
  ])
  
  function renderNode(node: Node): RenderedNode {
    const resolver = mergedResolvers.get(node.type)
    if (!resolver) {
      throw new Error(`No resolver found for node type ${node.type}`)
    }

    if (node.type === 'text') {
      return resolver(node)
    }
    
    const children = node.content ? node.content.map(render) : undefined
    
    return resolver({ 
      ...node, 
      children: children as VNode[],
    })
  }
  
  function render(node: Node | Node[]): RenderedNode | RenderedNode[] {
    return Array.isArray(node) ? node.map(renderNode) : renderNode(node)
  }

  return {
    render,
  }
}

export { SbRichText }
/* eslint-enable @typescript-eslint/ban-ts-comment */
