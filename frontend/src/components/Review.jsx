import React from "react";

const Review = ({ review, renderStars }) => {
  return (
    <div className="review mt-3">
      <div>
        <strong>{review.name}</strong> - {renderStars(review.rating)}
      </div>
      <p>{review.comment}</p>
    </div>
  );
};

export default Review;
