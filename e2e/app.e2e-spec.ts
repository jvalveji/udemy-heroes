import { HSVP.COREPage } from './app.po';

describe('hsvp.core App', () => {
  let page: HSVP.COREPage;

  beforeEach(() => {
    page = new HSVP.COREPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
