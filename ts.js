export var ts = {
    tasks: {},
    lastTaskId: -1,

    setTimeout(code, delay, repeat) {
        var taskId = ts.lastTaskId + 1;
        ts.lastTaskId++;

        ts.tasks[taskId] = {
            code: code,
            delay: delay,
            exeTime: api.now() + delay * 50,
            repeat: repeat ?? false
        };

        return taskId;
    },

    cancelTask(taskId) {
        delete ts.tasks[taskId];
    },

    tick() {
        for (let taskId in ts.tasks) {
            var task = ts.tasks[taskId];

            if (api.now() >= task.exeTime) {
                task.code();

                if (!ts.tasks[taskId]) {
                    continue;
                }

                if (!task.repeat) {
                    ts.cancelTask(taskId);
                } else {
                    ts.tasks[taskId].exeTime = api.now() + task.delay * 50;
                }
            }
        }
    }
};
