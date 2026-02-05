import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../../components/Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when loading prop is true', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows spinner when loading', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('does not show spinner when not loading', () => {
    render(<Button>Not Loading</Button>)
    const button = screen.getByRole('button')
    expect(button.querySelector('svg.animate-spin')).not.toBeInTheDocument()
  })

  describe('variants', () => {
    it('applies primary variant styles by default', () => {
      render(<Button>Primary</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-primary-500')
    })

    it('applies secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-gray-100')
    })

    it('applies outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('border')
    })

    it('applies danger variant styles', () => {
      render(<Button variant="danger">Danger</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('bg-red-500')
    })

    it('applies ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('text-text-secondary')
    })
  })

  describe('sizes', () => {
    it('applies medium size by default', () => {
      render(<Button>Medium</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('px-4')
      expect(button.className).toContain('py-2')
    })

    it('applies small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('px-3')
      expect(button.className).toContain('py-1.5')
    })

    it('applies large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('px-6')
      expect(button.className).toContain('py-3')
    })
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Button ref={ref}>Ref Test</Button>)
    expect(ref).toHaveBeenCalled()
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement)
  })

  it('passes additional props to button element', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>)
    const button = screen.getByTestId('submit-btn')
    expect(button).toHaveAttribute('type', 'submit')
  })
})
