import { SafeHtmlStylePipe } from './safe-html-style.pipe';

describe('SafePipe', () => {
  it('create an instance', () => {
    const pipe = new SafeHtmlStylePipe(null);
    expect(pipe).toBeTruthy();
  });
});
