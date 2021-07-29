import { mount } from 'enzyme';
import LoginButton from "../../../src/components/general/loginButton";

describe("Login Button", () => {
  it("renders anchor component button", () => {
    const wrapper = mount(<LoginButton isAuthed={false} />)
    expect(wrapper.find('a')).toHaveLength(1)
  })
  it("renders correct text", () => {
    let wrapper = mount(<LoginButton isAuthed={false} />)
    expect(wrapper.find('a').text()).toEqual('Login')

    wrapper.unmount()
    wrapper = mount(<LoginButton isAuthed={true} />)
    expect(wrapper.find('a').text()).toEqual('Logout')
  })
})