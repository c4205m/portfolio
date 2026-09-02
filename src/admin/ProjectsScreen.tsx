import type { Project } from "../types/content";
import { Button, Empty, Icon, IconButton, useDragList } from "./ui";

interface ProjectsScreenProps {
  projects: Project[];
  dirty: Set<number>;
  onOpen: (index: number) => void;
  onCreate: () => void;
  onDuplicate: (index: number) => void;
  onDelete: (index: number) => void;
  onReorder: (from: number, to: number) => void;
}

export function ProjectsScreen({ projects, dirty, onOpen, onCreate, onDuplicate, onDelete, onReorder }: ProjectsScreenProps) {
  const { bind, over } = useDragList(onReorder);

  return (
    <div className="wp-screen">
      <header className="wp-screen-head">
        <h1>Projects</h1>
        <Button variant="primary" onClick={onCreate}>
          <Icon.plus size={15} /> Add new
        </Button>
      </header>

      {projects.length === 0 ? (
        <Empty title="No projects yet" hint="Add one to create src/data/projects/<slug>.ts." action={<Button variant="primary" onClick={onCreate}>Add new</Button>} />
      ) : (
        <table className="wp-table">
          <thead>
            <tr>
              <th scope="col" className="wp-col-grip">
                <span className="wp-sr">Order</span>
              </th>
              <th scope="col">Title</th>
              <th scope="col">Slug</th>
              <th scope="col">Tags</th>
              <th scope="col">Blocks</th>
              <th scope="col" className="wp-col-actions">
                <span className="wp-sr">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index} className={over === index ? "drop" : undefined} {...bind(index)}>
                <td className="wp-col-grip">
                  <span className="wp-grip" title="Drag to reorder">
                    <Icon.drag size={16} />
                  </span>
                </td>
                <td>
                  <button type="button" className="wp-row-title" onClick={() => onOpen(index)}>
                    {project.title || "(untitled)"}
                  </button>
                  {dirty.has(index) && <span className="wp-dot" title="Unsaved changes" />}
                </td>
                <td className="wp-mono">{project.slug}</td>
                <td>
                  <span className="wp-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="wp-tag">
                        {tag}
                      </span>
                    ))}
                  </span>
                </td>
                <td>{project.sections.length}</td>
                <td className="wp-col-actions">
                  <Button onClick={() => onOpen(index)}>Edit</Button>
                  <IconButton label={`Duplicate ${project.slug}`} icon={<Icon.copy size={15} />} onClick={() => onDuplicate(index)} />
                  <IconButton label={`Delete ${project.slug}`} icon={<Icon.trash size={15} />} danger onClick={() => onDelete(index)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
