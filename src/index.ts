/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Component, RendererElement, RendererNode, VNode } from 'vue'
import { createTextVNode, h, resolveDynamicComponent } from 'vue'
import SbRichText from './components/SbRichText.vue'
import { StoryblokComponent } from '@storyblok/vue'
import { 
  Node,
  SbRichtextOptions,
  NodeResolver,
  TextNode,
  MarkNode,
  LinkTypes,
  NodeTypes,
  BlockTypes,
  TextTypes,
  MarkTypes,
  ComponentTypes 
} from './types'

const attrsToStyle = (attrs: Record<string, string> = {}) => Object.keys(attrs)
  .map(key => `${key}: ${attrs[key]}`)
  .join('; ')


export function useSbRichtext(options: SbRichtextOptions = {
  resolvers: {},
}) {
  const renderFn = h
  const { resolvers = {} } = options
/*   const components = getCurrentInstance()?.appContext.components */

  const nodeResolver = (tag: string): NodeResolver => (node: Node): VNode => renderFn(tag, node.attrs || {}, node.children)

  const headingResolver: NodeResolver = (node: Node): VNode => renderFn(`h${node.attrs?.level}`, node.attrs || {}, node.children)

  const emojiResolver: NodeResolver = (node: Node): VNode => renderFn('span', {
    'data-type': 'emoji',
    'data-name': node.attrs?.name,
    'emoji': node.attrs?.emoji,
  }, renderFn('img', {
    src: node.attrs?.fallbackImage,
    alt: node.attrs?.alt,
    style: 'width: 1.25em; height: 1.25em; vertical-align: text-top',
    draggable: 'false',
    loading: 'lazy',
  }, ''))

  // Mark resolver for text formatting
  const markResolver = (tag: string, styled = false): NodeResolver => ({ text, attrs }): VNode => {
    return renderFn(tag, styled
      ? {
          style: attrsToStyle(attrs),
        }
      : attrs || {}, text as string)
  }

  const renderToT = (node: any): VNode => {
    // Implementation that ensures the return type is T
    // This might involve checking the type of T and handling accordingly
    return render(node) as unknown as VNode
  }

  // Resolver for plain text nodes
  const textResolver: NodeResolver = (node: Node): VNode => {
    const { marks, ...rest } = node as TextNode
    if ('text' in node) {
      // Now TypeScript knows that 'node' is a TextNode, so 'marks' can be accessed

      return marks
        ? marks.reduce(
          (text: VNode, mark: MarkNode) => renderToT({ ...mark, text }), // Fix: Ensure render function returns a string
          renderToT({ ...rest, children: rest.children })
        ) as unknown as VNode
        : createTextVNode(rest.text) as VNode // Fix: Ensure escapeHtml returns a string
    }
    else {
      return h('') // Fix: Ensure empty string is of type string
    }
  }

  const codeBlockResolver: NodeResolver = (node: Node): VNode => {
    return renderFn('pre', {
      pros: node.attrs?.pros,
    }, renderFn('code', {}, node.children || '' as any))
  }

  /* const componentResolver: NodeResolver = ({ attrs, children }) => {
    const { component, file, _preview, preview, _editable, ...rest } = attrs?.body[0]
    return components ? h(components[attrs?.body[0].component], {
      id: attrs?.id,
      blok: rest,
    }, children) : h('div', {}, children)
  } */
  const componentResolver: NodeResolver = (node: Node): VNode => {
    return renderFn(StoryblokComponent, {
      blok: node?.attrs?.body[0],
      id: node.attrs?.id,
    }, node.children)
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
    [BlockTypes.DOCUMENT, nodeResolver('div')],
    [BlockTypes.HEADING, headingResolver],
    [BlockTypes.PARAGRAPH, nodeResolver('p')],
    [BlockTypes.UL_LIST, nodeResolver('ul')],
    [BlockTypes.OL_LIST, nodeResolver('ol')],
    [BlockTypes.LIST_ITEM, nodeResolver('li')],
    [BlockTypes.IMAGE, nodeResolver('img')],
    [BlockTypes.EMOJI, emojiResolver],
    [BlockTypes.CODE_BLOCK, codeBlockResolver],
    [BlockTypes.QUOTE, nodeResolver('blockquote')],
    [BlockTypes.HR, nodeResolver('hr')],
    [BlockTypes.BR, nodeResolver('br')],
    [TextTypes.TEXT, textResolver],
    [MarkTypes.LINK, linkResolver],
    [MarkTypes.ANCHOR, linkResolver],
    [MarkTypes.STYLED, markResolver('span')],
    [MarkTypes.BOLD, markResolver('strong')],
    [MarkTypes.TEXT_STYLE, markResolver('span', true)],
    [MarkTypes.ITALIC, markResolver('em')],
    [MarkTypes.UNDERLINE, markResolver('u')],
    [MarkTypes.STRIKE, markResolver('s')],
    [MarkTypes.CODE, markResolver('code')],
    [MarkTypes.SUPERSCRIPT, markResolver('sup')],
    [MarkTypes.SUBSCRIPT, markResolver('sub')],
    [MarkTypes.HIGHLIGHT, markResolver('mark')],
    [ComponentTypes.COMPONENT, componentResolver],
    // eslint-disable-next-line max-len
    ...(Object.entries(resolvers).map(([type, resolver]) => [type as NodeTypes, resolver])) as Array<[NodeTypes, NodeResolver]>,
  
  ])
  
  function renderNode(node: Node): VNode {
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
      children: children as unknown as VNode,
    })
  }
  
  function render(node: Node | Node[]): VNode<RendererNode, RendererElement, { [key: string]: any; }>[] {
    return Array.isArray(node) ? node.map(renderNode) : [renderNode(node)]
  }

  return {
    render,
  }
}

export { SbRichText }
