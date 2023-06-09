import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cn } from '../../utils/styles';
import { dateFormat } from '../../utils/date';
import Review from './components/Review';
import Line from '../../components/Line';
import Icon from '../../components/Icon';
import Loading from '../../components/Loading';
import useGetFetch from '../../hooks';
import css from './Detail.module.scss';

const reviewInit = {
  id: 0,
  userId: '단백질마렵다',
  rating: 0,
  description: '',
  createAt: dateFormat(),
};

const Detail = () => {
  const params = useParams();
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState(reviewInit);
  const [isOpenReview, setIsOpenReview] = useState(false);

  const { data, loading } = useGetFetch(`/data/detail/${params.id}.json`);

  const { shopTitle, rating, famous, location, time, menu, review } = data;

  useEffect(() => {
    setReviews(review);
  }, [data]);

  const handelActiveBtn = type => {
    type === 'review' && setIsOpenReview(prev => !prev);
  };

  if (loading) return <Loading />;

  return (
    <section>
      <article className={css.infoContainer}>
        <img
          src="/images/food/chicken.jpg"
          alt="shop"
          className={css.shopImg}
        />
        <div className={css.infoBox}>
          <span className={css.title}>{shopTitle}</span>
          <span className={css.recommand}>
            <Icon icon="faStar" />
            {rating}
          </span>
          <span className={css.recommand}>
            <Icon icon="faThumbsUp" />
            {famous}
          </span>
          <Line />
          <div className={css.infoWrap}>
            <span>
              <Icon icon="faLocationDot" />
              {location}
            </span>
            <span>
              <Icon icon="faClock" />
              {time}
            </span>
          </div>
          <div className={css.menuBox}>
            <span className={css.menuText}>MENU</span>
            {menu.map(({ id, name, price, protein, pick }) => {
              return (
                <div className={css.menuCard} key={id}>
                  <label className={css.pick}>{pick && '추천'}</label>
                  <span className={css.menuTitle}>{name}</span>
                  <span className={css.menuinfo}>
                    가격 : {price.toLocaleString()} ₩
                  </span>
                  <span className={css.menuinfo}>
                    단백질 함유량 : {protein}g
                  </span>
                  <span>(1인분 기준)</span>
                </div>
              );
            })}
          </div>
          <div className={css.buttonBox}>
            {RESERVE_BUTTON_LIST.map(list => {
              return (
                <button
                  key={list.id}
                  className={cn(`${css.button}`, `${css[list.class]}`)}
                  onClick={() => handelActiveBtn(list.type)}
                >
                  {list.title}
                </button>
              );
            })}
          </div>
        </div>
      </article>
      <Review
        reviews={reviews}
        setReviews={setReviews}
        isOpenReview={isOpenReview}
        setIsOpenReview={setIsOpenReview}
        reviewText={reviewText}
        setReviewText={setReviewText}
        reviewInit={reviewInit}
      />
    </section>
  );
};

export default Detail;

const RESERVE_BUTTON_LIST = [
  { id: 1, title: '리뷰달기', class: 'black', type: 'review' },
  { id: 2, title: '주문하기', class: 'eatDeal', type: 'order' },
  { id: 3, title: '예약하기', class: 'main', type: 'booking' },
];
