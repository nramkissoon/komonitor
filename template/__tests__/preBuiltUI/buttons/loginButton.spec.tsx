import { Button } from '@chakra-ui/react';
import { mount, shallow } from 'enzyme';
import * as sinon from 'sinon';
import { LoginButton } from "../../../src/prebuiltUI/buttons/loginButton";

describe("Login Button", () => {

  it("renders anchor component button", () => {
    const wrapper = mount(<LoginButton isAuthed={false} logout={() => { }}/>)
    expect(wrapper.find('button')).toHaveLength(1)
  })

  it("renders correct text", () => {
    let wrapper = mount(<LoginButton isAuthed={false} logout={() => { }}/>)
    expect(wrapper.find('button').text()).toEqual('Log in')

    wrapper.unmount()
    wrapper = mount(<LoginButton isAuthed={true} logout={() => { }}/>)
    expect(wrapper.find('button').text()).toEqual('Log out')
  })

  it("Link Component href is correct and passed to button when isAuthed is false", () => {
    const wrapper = mount(<LoginButton isAuthed={false} logout={() => { }} />)
    expect(wrapper.find('button').props().href).toEqual('/auth')
  })

  it("Link Component href not passed to button when isAuthed is true", () => {
    const wrapper = mount(<LoginButton isAuthed={true} logout={() => { }} />)
    expect(wrapper.find('button').props().href).toBe(undefined)
  })

  it("logout() works when clicked when isAuthed is true", () => {
    const logout = {func: () => { }}
    const mock = sinon.mock(logout)
    mock.expects("func").once()

    const wrapper = mount(<LoginButton isAuthed={true} logout={logout.func} />)
    wrapper.find('button').simulate('click')
    mock.verify()
  })

  it("Button props overrides works correctly", () => {
    const wrapper = shallow(<LoginButton isAuthed={false} logout={() => { }} size='lg' />)
    expect(wrapper.find(Button).props().size).toBe('lg')
  })

  it("Button props defaults works correctly", () => {
    const wrapper = shallow(<LoginButton isAuthed={false} logout={() => { }} />)
    expect(wrapper.find(Button).props().size).toBe('md')
  })
})