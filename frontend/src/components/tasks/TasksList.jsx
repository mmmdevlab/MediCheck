import React from 'react';
import PropTypes from 'prop-types';
import { CheckSquare, Square } from 'lucide-react';

const TasksList = ({ tasks = [], onToggleTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="border-t border-gray-100 pt-4">
        <p className="text-gray-400 text-sm text-center py-4">
          No tasks for this appointment
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 pt-4 space-y-2">
      <h4 className="text-xs uppercase tracking-widest font-bold text-gray-600 mb-3">
        TASKS
      </h4>

      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onToggleTask(task.id)}
          className="
            w-full flex items-start gap-3 p-3
            hover:bg-gray-50 rounded-xl
            transition-colors text-left
          "
        >
          {task.isCompleted ? (
            <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <Square className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                task.isCompleted
                  ? 'text-gray-400 line-through'
                  : 'text-gray-900'
              }`}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-gray-500 mt-1">{task.description}</p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

TasksList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      isCompleted: PropTypes.bool,
    })
  ),
  onToggleTask: PropTypes.func.isRequired,
};

export default TasksList;
