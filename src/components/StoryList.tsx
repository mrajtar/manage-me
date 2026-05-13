import type { Story } from "../models/Story";

type Props = {
  stories: Story[];
  onDelete: (id: string) => void;
  onUpdate: (story: Story) => void;
  onSelect: (id: string) => void;
};

export const StoryList = ({ stories, onDelete, onUpdate, onSelect }: Props) => {
  const handleEdit = (story: Story) => {
    const name = prompt("Edit Story Name:", story.name);
    const description = prompt("Edit Description:", story.description);
    if (name && description) {
      onUpdate({ ...story, name, description});
    }
    }
  
  const grouped = {
    todo: stories.filter((s) => s.status === "todo"),
    doing: stories.filter((s) => s.status === "doing"),
    done: stories.filter((s) => s.status === "done"),
  };

  return (
    <div className="row g-4 mb-5">
      {Object.entries(grouped).map(([status, items]) => (
        <div className="col-md-4" key={status}>
          <div className="card shadow-sm h-100 p-3">
            <h4 className="text-center mb-4">{status.toUpperCase()}</h4>
            <div className="d-flex flex-column gap-3">
              {items.map((s) => (
                <div key={s.id} className="border rounded p-3">
                  <div className="fw-bold">Name: {s.name}</div>
                  <div className="small mb-2">Priority: {s.priority}</div>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onSelect(s.id)}
                    >
                      Select
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(s.id)}
                    >
                      Delete
                    </button>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "120px" }}
                      value={s.status}
                      onChange={(e) =>
                        onUpdate({
                          ...s,
                          status: e.target.value as "todo" | "doing" | "done",
                        })
                      }
                    >
                      <option value="todo">Todo</option>
                      <option value="doing">Doing</option>
                      <option value="done">Done</option>
                    </select>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "120px" }}
                      value={s.priority}
                      onChange={(e) =>
                        onUpdate({ ...s, priority: e.target.value as any })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
