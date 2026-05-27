

function Post({ props }) {
  return (
    <div className="mt-4 flex flex-col gap-3">
              {/* POST CARD */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* LEFT */}
                <div className="flex gap-3">
                  <img
                    src="https://i.pravatar.cc/101"
                    alt="profile"
                    className="w-12 h-12 rounded-full"
                  />

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="font-semibold text-violet-600">
                        {props.name}
                      </h1>
                    </div>

                    <p className="text-gray-800 mt-1 font-medium text-sm md:text-base">
                      Hey, anyone up for coffee? ☕
                    </p>

                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                      Connaught Place, New Delhi 
                    </p>
                  </div>
                </div>

                {/* BUTTON */}
                <button className="border border-violet-200 text-violet-600 hover:bg-violet-50 transition px-5 py-3 rounded-xl font-medium w-full md:w-auto">
                  Send Request
                </button>
              </div>
            </div>
  )}

export default Post;