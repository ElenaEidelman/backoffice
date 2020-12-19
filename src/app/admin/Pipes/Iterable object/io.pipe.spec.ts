import { IOPipe } from './io.pipe';

describe('IOPipe', () => {
  it('create an instance', () => {
    const pipe = new IOPipe();
    expect(pipe).toBeTruthy();
  });
});
