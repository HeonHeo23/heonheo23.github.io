"use client";

const AddIdea = ({
  createIdea,
}: {
  createIdea: (formData: FormData) => void | Promise<void>;
}) => {
  return (
    <>
      <button
        className="btn btn-primary mt-4 self-start"
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
          <form
            action={createIdea}
            className="flex flex-col mx-auto gap-4 w-full max-w-3xl"
          >
            <fieldset className="fieldset w-full p-5">
              <legend className="fieldset-legend">New Idea</legend>
              <label className="input w-full">
                <span className="label w-30">Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Example: Methodism"
                  required
                />
              </label>
              <label className="input w-full">
                <span className="label w-30">Description</span>
                <input
                  type="text"
                  name="description"
                  placeholder="Short description..."
                />
              </label>
              <label className="input w-full">
                <span className="label w-30">Origin Year</span>
                <input
                  type="text"
                  name="originDate"
                  placeholder="Example: 1784"
                  required
                />
              </label>
              {/* <div className="modal-action"> */}
              <button
                type="submit"
                className="btn btn-primary mt-2 self-start"
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
              {/* </div> */}
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
