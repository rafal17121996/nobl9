import { mount } from '@vue/test-utils';
import Footer from '../../src/components/Footer.vue'

describe('Footer.vue', () => {
  it('renders the footer with the correct text', () => {
    const wrapper = mount(Footer);
    expect(wrapper.text()).toContain('© 2024 Quiz App - All Rights Reserved');
  });

  it('has the correct CSS classes', () => {
    const wrapper = mount(Footer);

    const footer = wrapper.find('footer');
    expect(footer.classes()).toContain('footer');
    expect(footer.classes()).toContain('text-gray-500');
    expect(footer.classes()).toContain('dark:text-gray-400');
    expect(footer.classes()).toContain('bg-gray-100');
  });
});
