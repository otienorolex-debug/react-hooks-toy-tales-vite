import { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const TOYS_URL = "http://localhost:3001/toys";

function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchToys() {
      try {
        const response = await fetch(TOYS_URL);
        if (!response.ok) {
          throw new Error(`Could not load toys (${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("The toys API did not return a list.");
        }
        if (active) setToys(data);
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Could not load toys.");
        }
      }
    }

    fetchToys();
    return () => {
      active = false;
    };
  }, []);

  async function handleAddToy(toyDetails) {
    setError("");
    const response = await fetch(TOYS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...toyDetails, likes: 0 }),
    });
    if (!response.ok) {
      throw new Error(`Could not add toy (${response.status}).`);
    }

    const newToy = await response.json();
    setToys((currentToys) => [...currentToys, newToy]);
  }

  async function handleLikeToy(toy) {
    setError("");
    const likes = (Number(toy.likes) || 0) + 1;
    try {
      const response = await fetch(`${TOYS_URL}/${encodeURIComponent(toy.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes }),
      });
      if (!response.ok) {
        throw new Error(`Could not like toy (${response.status}).`);
      }

      const updatedToy = await response.json();
      setToys((currentToys) =>
        currentToys.map((currentToy) =>
          currentToy.id === toy.id
            ? { ...currentToy, ...updatedToy, likes: updatedToy.likes ?? likes }
            : currentToy,
        ),
      );
    } catch (requestError) {
      setError(requestError.message || "Could not like toy.");
    }
  }

  async function handleDonateToy(toy) {
    setError("");
    try {
      const response = await fetch(`${TOYS_URL}/${encodeURIComponent(toy.id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Could not donate toy (${response.status}).`);
      }

      setToys((currentToys) =>
        currentToys.filter((currentToy) => currentToy.id !== toy.id),
      );
    } catch (requestError) {
      setError(requestError.message || "Could not donate toy.");
    }
  }

  function handleClick() {
    setShowForm((currentlyShowing) => !currentlyShowing);
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      {error && <p role="alert">{error}</p>}
      <ToyContainer
        toys={toys}
        onLikeToy={handleLikeToy}
        onDonateToy={handleDonateToy}
      />
    </>
  );
}

export default App;
