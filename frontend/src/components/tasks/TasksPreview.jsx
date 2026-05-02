import React from 'react';
import PropTypes from 'prop-types';

const TasksPreview = ({ tasks, appointmentId }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="text-xs uppercase tracking-widest font-bold text-gray-600 mb-2">
          TASKS FOR THIS VISIT
        </div>
        <p className="text-sm text-gray-500">No tasks generated</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-xs uppercase tracking-widest font-bold text-gray-600 mb-2">
        TASKS FOR THIS VISIT
      </div>

      <div className="space-y-2">
        {tasks.slice(0, 3).map((task) => (
          <div key={task.id} className="flex items-center gap-2 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-gray-700">{task.title}</span>
            {task.dueDate && (
              <span className="text-gray-400 text-xs">({task.dueDate})</span>
            )}
          </div>
        ))}

        {tasks.length > 3 && (
          <p className="text-xs text-blue-500 font-semibold mt-2">
            +{tasks.length - 3} more tasks
          </p>
        )}
      </div>
    </div>
  );
};

TasksPreview.propTypes = {
  tasks: PropTypes.array,
  appointmentId: PropTypes.number,
};

export default TasksPreview;
