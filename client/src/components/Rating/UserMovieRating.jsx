const UserMovieRating = ({ userRating }) => {
  if (!userRating) return null;

  return (
    <div className="mt-3 flex items-center gap-3">
      <span className="font-semibold text-white">
        {userRating.user?.name || "You"}
      </span>
      <span className="text-yellow-400 text-lg">
        ⭐ {userRating.rating}/10
      </span>
    </div>
  );
};

export default UserMovieRating;



