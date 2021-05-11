import { SafeURLPipe } from './safe-url-html.pipe';

describe('SafeHtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeURLPipe(null);
    expect(pipe).toBeTruthy();
  });
});
