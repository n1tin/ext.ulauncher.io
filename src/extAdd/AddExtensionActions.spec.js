import { submitExtension, validateExtensionUrl } from './AddExtensionActions'
import * as api from '../api'

jest.mock('../api', () => ({
  checkProject: jest.fn(),
  submitExtension: jest.fn(() =>
    Promise.resolve({
      data: {
        ID: 'new-id'
      }
    })
  )
}))

/**
 * submitExtension
 */

it('submitExtension() calls api with correct args', async () => {
  const data = { Name: 'a', Description: 'b' }
  const history = { push: jest.fn() }
  await submitExtension(data, history).payload
  expect(api.submitExtension).toHaveBeenCalledWith(data)
})

it('submitExtension() redirects to details page on success', async () => {
  const data = { Name: 'a', Description: 'b' }
  const history = { push: jest.fn() }
  await submitExtension(data, history).payload
  expect(history.push).toHaveBeenCalledWith('/-/new-id')
})

it('submitExtension() throws an error if Name is empty', async () => {
  const data = { Name: '', Description: 'b' }
  const history = { push: jest.fn() }
  expect(submitExtension(data, history).payload).rejects.toEqual({
    errors: {
      Name: 'Name cannot be empty'
    }
  })
})

it('submitExtension() throws an error if Description is empty', async () => {
  const data = { Name: 'b' }
  const history = { push: jest.fn() }
  expect(submitExtension(data, history).payload).rejects.toEqual({
    errors: {
      Description: 'Description cannot be empty'
    }
  })
})

it('submitExtension() throws if api.submitExtension() throws', async () => {
  const data = { Name: 'a', Description: 'b' }
  const history = { push: jest.fn() }
  const resp = { status: 500, description: 'server error' }
  api.submitExtension.mockImplementation(() => Promise.reject(resp))
  expect(submitExtension(data, history).payload).rejects.toEqual(resp)
})

/**
 * validateExtensionUrl
 */

it('validateExtensionUrl() calls api.checkProject()', async () => {
  const url = 'https://github.com/user/project'
  await validateExtensionUrl(url).promise
  expect(api.checkProject).toHaveBeenCalledWith(url)
})

it('validateExtensionUrl() returns result of api.checkProject()', async () => {
  const url = 'https://github.com/user/project'
  const resp = { success: true }
  api.checkProject.mockReturnValue(resp)
  expect(validateExtensionUrl(url).payload).resolves.toEqual(resp)
})

it('validateExtensionUrl() throws "Invalid Github URL"', async () => {
  const url = 'https://notgithub.com/user/project'
  expect(validateExtensionUrl(url).payload).rejects.toEqual({
    error: { description: 'Invalid Github URL' }
  })
})

it('validateExtensionUrl() throws "Invalid Github URL"', async () => {
  const url = 'https://github.com/user/project'
  const resp = { status: 500, description: 'server error' }
  api.checkProject.mockImplementation(() => Promise.reject(resp))
  expect(validateExtensionUrl(url).payload).rejects.toEqual(resp)
})
