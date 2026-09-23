import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('does not call onSearch while the debounce window is still open', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} debounceMs={200} />)

    await user.type(screen.getByRole('searchbox'), 'engineer')

    // onSearch fires once with the initial empty value on mount, then should
    // not have fired again yet since the debounce window hasn't elapsed.
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenLastCalledWith('')
  })

  it('calls onSearch with the typed value after the debounce window elapses', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} debounceMs={10} />)

    await user.type(screen.getByRole('searchbox'), 'engineer')

    await vi.waitFor(() => {
      expect(onSearch).toHaveBeenLastCalledWith('engineer')
    })
  })
})
