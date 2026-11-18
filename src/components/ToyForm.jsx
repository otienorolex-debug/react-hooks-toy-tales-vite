import { useState } from "react";

function ToyForm({ onAddToy }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await onAddToy({ name: name.trim(), image: image.trim() });
      setName("");
      setImage("");
    } catch (requestError) {
      setError(requestError.message || "Could not add toy.");
    }
  }

  return (
    <div className="container">
      <form className="add-toy-form" onSubmit={handleSubmit}>
        <h3>Create a toy!</h3>
        <input
          type="text"
          name="name"
          placeholder="Enter a toy's name..."
          className="input-text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <br />
        <input
          type="text"
          name="image"
          placeholder="Enter a toy's image URL..."
          className="input-text"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          required
        />
        <br />
        <button type="submit" className="submit">Create New Toy</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}

export default ToyForm;
