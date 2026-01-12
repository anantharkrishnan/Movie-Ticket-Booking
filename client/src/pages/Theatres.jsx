import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axiosInstance";

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get("theatre/alltheatres")
      .then((res) => {
        const theatresData = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setTheatres(theatresData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setTheatres([]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="text-3xl text-white my-10 text-center">Theatres</h2>

      {loading && (
        <p className="text-white text-center">Loading...</p>
      )}

      <ul>
        {theatres.map((t) => (
          <li key={t._id}>
            <div className="border p-4 mx-9 text-white my-4 text-center rounded-3xl">
              <h3 className="text-2xl font-bold">{t.name}</h3>
              <p className="text-lg">{t.location}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Theatres;
