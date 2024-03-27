import { describe, expect, it } from 'vitest'
import { useSbRichtext } from '../src/'

describe('renderer', () => {
  it('should render a paragraph', () => {
    const { render } = useSbRichtext()
    const rendered = render({
      type: 'paragraph',
      content: [
        {
          text: 'Hi! ',
          type: 'text',
        },
      ],
    })
    expect(rendered.type).toBe('p')
    expect(rendered.children.length).toBe(1)
    /* expect(`${rendered.type}`).toBe('Symbol(v-txt)')
    rendered.type.   */
  })
  it('should render a paragraph with a class attr', () => {
    const { render } = useSbRichtext()
    const rendered = render({
      type: 'paragraph',
      attrs: {
        class: 'text-primary',
      },
      content: [
        {
          text: 'Hi! ',
          type: 'text',
        },
      ],
    })
    expect(rendered.props.class).toBe('text-primary')
  })
  it('should render a bold text', () => {
    const { render } = useSbRichtext()
    const renderer = render({
      type: 'text',
      marks: [
        {
          type: 'bold',
        },
      ],
    })
  })
  it('should render a h1', () => {
    const { render } = useSbRichtext()
    const rendered = render({
      type: 'heading',
      attrs: {
        level: 1,
      },
      content: [
        {
          text: 'H1 ',
          type: 'text',
        },
      ],
    })
    expect(rendered.type).toBe('h1')
  })
  it('should render a blockquote', () => {
    const { render } = useSbRichtext()
    const rendered = render({
      type: 'blockquote',
      content: [
        {
          text: 'I\'m a quote',
          type: 'text',
        },
      ],
    })
    expect(rendered.type).toBe('blockquote')
  })
})
