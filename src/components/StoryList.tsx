import type { Story } from "../models/Story";

type Props = {
  stories: Story[];
  onDelete: (id: string) => void;
  onUpdate: (story: Story) => void;
};

export const StoryList = ({ stories, onDelete, onUpdate }: Props) => {
  const grouped = {
    todo: stories.filter(s => s.status === "todo"),
    doing: stories.filter(s => s.status === "doing"),
    done: stories.filter(s => s.status === "done")
  };

  return (
    <ul>
      {Object.entries(grouped).map(([status, items]) => (
        <div key={status}>
          <h3>{status.toUpperCase()}</h3>
          {items.map(s => (
            <div key={s.id}>
              {s.name} ({s.priority})
              <button onClick={() => onDelete(s.id)}>Delete</button>
                <select
                    value={s.status}
                    onChange={e =>
                    onUpdate({
                        ...s,
                        status: e.target.value as "todo" | "doing" | "done"
                        })
                        }
                        >
                    <option value="todo">Todo</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                    </select>
            </div>
          ))}
        </div>
      ))}
    </ul>
  );
};