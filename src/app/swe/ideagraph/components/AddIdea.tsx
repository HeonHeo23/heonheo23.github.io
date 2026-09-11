"use client";

import IdeaFields from "./IdeaFields";

const AddIdea = ({
  createIdea,
}: {
  createIdea: (formData: FormData) => void | Promise<void>;
}) => {
  return (
    <>
      <button
        className="btn mt-4 self-start btn-primary"
        onClick={() =>
          (
            document.getElementById("add-idea-modal") as HTMLDialogElement
          )?.showModal()
        }
      >
        Create Idea
      </button>
      <dialog id="add-idea-modal" className="modal">
        <div className="modal-box p-6 sm:p-8">
          <form action={createIdea} className="form-shell">
            <fieldset className="fieldset w-full p-5">
              <legend className="fieldset-legend">New Idea</legend>
              <IdeaFields />
              <button
                type="submit"
                className="btn mt-2 self-start btn-primary"
                onClick={() =>
                  (
                    document.getElementById(
                      "add-idea-modal",
                    ) as HTMLDialogElement
                  )?.close()
                }
              >
                Create Idea
              </button>
            </fieldset>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default AddIdea;
