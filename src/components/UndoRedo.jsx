import { useHotkeys } from 'react-hotkeys-hook';
import { useFormContext } from '../context/FormContext';

// Undo/redo controls
function UndoRedo() {
  const { undo, redo } = useFormContext();

  useHotkeys('ctrl+z', undo);
  useHotkeys('ctrl+y', redo);

  return (
    <div className="flex gap-2">
      <button onClick={undo} className="p-2 bg-gray-500 text-white rounded">
        Undo
      </button>
      <button onClick={redo} className="p-2 bg-gray-500 text-white rounded">
        Redo
      </button>
    </div>
  );
}

export default UndoRedo;