import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";

const AdminCreateMovie = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    genre: "",
    description: "",
    duration: "",
    language: "",
    trailerUrl: "",
    releaseDate: "",
    certification: "",   
    posterUrl: "",
    backdropUrl: "",
  });

  const [posterFile, setPosterFile] = useState(null);
  const [backdropFile, setBackdropFile] = useState(null);
  const [cast, setCast] = useState([{ name: "", role: "", imageFile: null }]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCastChange = (index, field, value) => {
    const updated = [...cast];
    updated[index][field] = value;
    setCast(updated);
  };

  const addCastMember = () => setCast([...cast, { name: "", role: "", imageFile: null }]);
  const removeCastMember = (index) => setCast(cast.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (posterFile) formData.append("posterUrl", posterFile);
      if (backdropFile) formData.append("backdropUrl", backdropFile);

      const castData = cast.map(({ name, role }) => ({ name, role }));
      formData.append("cast", JSON.stringify(castData));
      cast.forEach((member) => member.imageFile && formData.append("castImages", member.imageFile));

      await axiosInstance.post("/movie/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Movie created successfully!");
      navigate("/admin/movies");
    } catch (err) {
      console.error(err);
      alert("Failed to create movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 text-white max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Create Movie</h1>

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
       
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 sm:p-3 rounded bg-gray-800 text-sm sm:text-base"
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={form.genre}
            onChange={handleChange}
            required
            className="w-full p-2 sm:p-3 rounded bg-gray-800 text-sm sm:text-base"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-2 sm:p-3 rounded bg-gray-800 resize-none h-24 sm:h-28 text-sm sm:text-base"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="number"
            name="duration"
            placeholder="Duration (min)"
            value={form.duration}
            onChange={handleChange}
            required
            className="w-full p-2 sm:p-3 rounded bg-gray-800 text-sm sm:text-base"
          />
          <input
            type="text"
            name="language"
            placeholder="Language"
            value={form.language}
            onChange={handleChange}
            required
            className="w-full p-2 sm:p-3 rounded bg-gray-800 text-sm sm:text-base"
          />
          <input
            type="date"
            name="releaseDate"
            value={form.releaseDate}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 rounded bg-gray-800 text-sm sm:text-base"
          />
        </div>

        <input
          type="url"
          name="trailerUrl"
          placeholder="Trailer URL"
          value={form.trailerUrl}
          onChange={handleChange}
          className="w-full p-2 sm:p-3 rounded bg-gray-800 text-sm sm:text-base"
        />

        <select
          name="certification"
          value={form.certification}
          onChange={handleChange}
          required
          className="w-full p-2 sm:p-3 rounded bg-gray-800 text-sm sm:text-base"
        >
          <option value="">Select Certification</option>
          <option value="U">U</option>
          <option value="U/A">U/A</option>
          <option value="A">A</option>
          <option value="S">S</option>
        </select>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 text-sm">Poster:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files[0])}
              className="w-full text-sm"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Backdrop:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBackdropFile(e.target.files[0])}
              className="w-full text-sm"
            />
          </div>
        </div>

      
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Cast Members</h2>
          <div className="space-y-2">
            {cast.map((member, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => handleCastChange(index, "name", e.target.value)}
                  required
                  className="flex-1 p-2 rounded bg-gray-800 text-sm"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={member.role}
                  onChange={(e) => handleCastChange(index, "role", e.target.value)}
                  required
                  className="flex-1 p-2 rounded bg-gray-800 text-sm"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCastChange(index, "imageFile", e.target.files[0])}
                  className="flex-1 text-sm"
                />
                {cast.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCastMember(index)}
                    className="bg-red-600 px-2 py-1 rounded mt-1 sm:mt-0 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addCastMember}
            className="bg-green-600 px-3 py-1 rounded mt-2 text-sm"
          >
            Add Cast Member
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded mt-4 w-full sm:w-auto text-sm sm:text-base"
        >
          {loading ? "Creating..." : "Create Movie"}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateMovie;





