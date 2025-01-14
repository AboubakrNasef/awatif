import { Index, createSignal } from "solid-js";
import { supabase } from "../Login/Login";

export type Project = {
  id: number;
  title: string;
  slug: string;
  user_id: string;
};

type ProjectsProps = {
  testingProjects?: Project[];
};

export function Projects(props: ProjectsProps) {
  const [projects, setProjects] = createSignal<Project[]>(
    props.testingProjects || []
  );
  const [projectTitle, setProjectTitle] = createSignal("");

  async function getProjects() {
    if (props.testingProjects) return;

    const user = await supabase.auth.getUser();

    let { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.data.user?.id);
    if (data) {
      setProjects(data as Project[]);
    }
  }

  async function addProject(e: SubmitEvent) {
    e.preventDefault();

    if (props.testingProjects) return;

    if (projectTitle()) {
      const user = await supabase.auth.getUser();

      const { data, error } = await supabase.from("projects").insert([
        {
          title: projectTitle(),
          slug: extractSlug(projectTitle()),
          user_id: user.data.user?.id,
        },
      ]);
    }

    setProjectTitle("");
    getProjects();
  }

  async function deleteProject(id: number) {
    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", `${id}`);

    getProjects();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  getProjects();

  return (
    <>
      <div class="overflow-x-auto max-h-44">
        <table class="table table-sm">
          <tbody>
            <Index each={projects()}>
              {(project) => (
                <tr class="group/item">
                  <td class="w-4/5">
                    <a
                      href={`./?user_id=${project().user_id}&slug=${
                        project().slug
                      }`}
                    >
                      {project().title}
                    </a>
                  </td>
                  <td class="w-1/5 act">
                    <a
                      class="btn btn-xs invisible group-hover/item:visible "
                      onclick={() => deleteProject(project().id)}
                    >
                      🗑
                    </a>
                  </td>
                </tr>
              )}
            </Index>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between">
        <form onSubmit={addProject}>
          <input
            class="input input-sm border-primary w-11/12"
            type="text"
            placeholder="Add new project"
            value={projectTitle()}
            onInput={(e) => setProjectTitle(e.currentTarget.value)}
          />
        </form>
        <a class="btn btn-xs btn-neutral mt-1" onclick={logout}>
          Logout
        </a>
      </div>
    </>
  );
}

function extractSlug(text: string) {
  let slug = text.toLowerCase().replace(/\s+/g, "-");
  slug = slug.replace(/[^a-z0-9-]/g, "");
  slug = slug.replace(/^-+|-+$/g, "");

  return slug;
}
