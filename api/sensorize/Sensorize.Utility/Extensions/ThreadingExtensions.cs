namespace Sensorize.Utility.Extensions
{
    public static class ThreadingExtensions
    {
        /// <summary>
        /// Fires and forgets a task with an option error handler
        /// </summary>
        /// <param name="task"></param>
        /// <param name="errorHandler"></param>
        public static void FireAndForget(this Task task, Action<Exception>? errorHandler = null)
        {
            task.ContinueWith(t =>
            {
                if (t.IsFaulted && t.Exception != null && errorHandler != null)
                    errorHandler(t.Exception);
            }, TaskContinuationOptions.OnlyOnFaulted);
        }
    }
}