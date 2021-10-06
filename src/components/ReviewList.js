import React from 'react';
import AdCard from './AdCard';
import ReviewCard from './ReviewCard';

function ReviewList({ reviews, showMedia }) {

  function returnIf(r) {
    if (r['ad']) return <AdCard ad={r} key={r['ad_id']} showMedia={showMedia} />
    else return <ReviewCard r={r}  key={r['cmtid']} showMedia={showMedia} />
  }

  if (Object.keys(reviews).length !== 0) {

    return reviews.map((r) =>
      returnIf(r)
    );
  } else return <></>
}

export default ReviewList
