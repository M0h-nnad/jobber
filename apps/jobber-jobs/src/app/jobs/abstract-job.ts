export abstract class AbstractJob {
  async execute(): Promise<void> {
    console.log('executing job');
    return;
  }
}
