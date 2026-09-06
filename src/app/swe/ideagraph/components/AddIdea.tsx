"use client";

const AddIdea = ({
  createIdea,
}: {
  createIdea: (formData: FormData) => void | Promise<void>;
}) => {
  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() =>
          (
            document.getElementById("add-idea-modal") as HTMLDialogElement
          )?.showModal()
        }
      >
        Create Idea
      </button>
      <dialog id="add-idea-modal" className="modal">
        <div className="modal-box">
          <form
            action={createIdea}
            className="flex flex-col mx-auto gap-4 w-full max-w-3xl"
          >
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
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
                  className="btn btn-primary"
                  onClick={() =>
                    (
                      document.getElementById(
                        "add-idea-modal"
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
