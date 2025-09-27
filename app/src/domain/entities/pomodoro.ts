export class Pomodoro {
  constructor(
    public readonly id: string,
    public readonly taskId: string,
    public readonly duration: number,
    public readonly startedAt: Date,
    public readonly completedAt: Date,
    public readonly type: 'work' | 'break',
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
