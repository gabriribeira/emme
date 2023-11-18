import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../../firebase';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom'

const Notifications = () => {

    const [user, setUser] = useState('');
    const [userNotifications, setUserNotification] = useState();
    const [userNotificationsId, setUserNotificationId] = useState();
    const [userNotificationsThisWeek, setUserNotificationsThisWeek] = useState();
    const [userNotificationsIdThisWeek, setUserNotificationsIdThisWeek] = useState();
    const [userNotificationsThisMonth, setUserNotificationsThisMonth] = useState();
    const [userNotificationsIdThisMonth, setUserNotificationsIdThisMonth] = useState();
    const [userNotificationsOlder, setUserNotificationsOlder] = useState();
    const [userNotificationsIdOlder, setUserNotificationsIdOlder] = useState();
    const [newsArticles, setNewsArticles] = useState('');
    const [newsArticlesDivs, setNewsArticlesDivs] = useState('');

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const getUserId = () => {
                    const userSearchId = auth.currentUser.uid;
                    setUser(userSearchId);
                }
                getUserId();
                getNotifications();
            }
        });
    }, []);

    const getNotifications = async () => {

        var docsArray = [];
        var docsIdArray = [];

        const notifications = await getDocs(query(collection(db, `users/${auth.currentUser.uid}/notifications`), orderBy("createdAt", "desc")));

        notifications.forEach((doc) => {
            docsArray.push(doc.data());
            docsIdArray.push(doc.id);
        });

        setUserNotification(docsArray);
        setUserNotificationId(docsIdArray);

    }

    useEffect(() => {

        const getNews = async () => {

            var url = 'https://newsapi.org/v2/everything?' +
                'q=music&album&spotify&' +
                'sortBy=popularity&' +
                'apiKey=299e9eb40f87449a8f9753f6a4cc8d52&' +
                'pageSize=20';

            var req = new Request(url);

            await fetch(req).then(response => response.json()).then(data => { setNewsArticles(data.articles); });

        }

        getNews();

    }, [])

    useEffect(() => {

        let newsArray = [];

        if (newsArticles != '' && newsArticles && newsArticles != null && newsArticles != undefined) {

            newsArticles.map(element => {
                newsArray.push(
                    <a href={element.url} target="_blank" className='flex w-full items-center my-5 hover:bg-preto/5 p-2 rounded-md'>
                        <img className='w-[70px] h-[70px] rounded-full object-cover' src={element.urlToImage} alt="User Profile Pic" />
                        <div className='flex flex-col'>
                            <div className='flex mx-7'>
                                <h1 className='text-xl font-semibold text-preto'>{element.title} <span className='text-lg text-preto/70'> * {element.source.name}</span></h1>
                            </div>
                            <div className='flex flex-col mx-7'>
                                <h1 className='text-lg text-preto'>{element.description}</h1>
                            </div>
                        </div>
                    </a>
                )
            })

            setNewsArticlesDivs(newsArray);

        }

    }, [newsArticles])

    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    }

    useEffect(() => {

        const handleNotifications = () => {

            const date = new Date();
            let currentDay = date.getDate();
            let currentMonth = date.getMonth() + 1;
            let currentYear = date.getFullYear();

            let thisWeekArray = [];
            let thisWeekIdArray = [];
            let thisMonthArray = [];
            let thisMonthIdArray = [];
            let olderArray = [];
            let olderIdArray = [];

            userNotifications.forEach(element => {

                if ((element.day >= getDaysInMonth(currentDay, currentMonth) - currentDay && element.month == currentMonth - 1) || (element.day >= currentDay - 7 && currentMonth == element.month)) {
                    thisWeekArray.push(
                        <div className='flex w-full items-center my-3 hover:bg-preto/5 p-2 rounded-md'>
                            <img className='w-[70px] h-[70px] rounded-full object-cover' src={element.image} alt="User Profile Pic" />
                            <div className='flex flex-col mx-7'>
                                {element.anon == true ?
                                    <>
                                        <div className='text-lg font-semibold text-preto'>{element.friendName.toUpperCase()}</div>
                                        <div className='text-preto text-lg'>{element.friendUsername}</div>
                                    </>
                                    :
                                    <>
                                        <Link to="/user" state={{ iduser: element.friendId }} className='text-lg font-semibold text-preto'>{element.friendName.toUpperCase()}</Link>
                                        <Link to="/user" state={{ iduser: element.friendId }} className='text-preto text-lg'>{element.friendUsername}</Link>
                                    </>
                                }
                            </div>
                            <div className='flex flex-col'>
                                <h1 className='text-lg text-preto font-semibold'>{element.notificationTitle}</h1>
                                <h1 className='text-lg text-preto'>{element.notificationBody}</h1>
                            </div>
                        </div>
                    )
                } else if (element.month == currentMonth || (element.month == currentMonth - 1 && element.day >= currentDay)) {

                    thisMonthArray.push(
                        <div className='flex w-full items-center my-3'>
                            <img className='w-[70px] h-[70px] rounded-full object-cover' src={element.image} alt="User Profile Pic" />
                            <div className='flex flex-col mx-7'>
                                <Link to="/user" state={{ iduser: element.friendId }} className='text-xl font-semibold text-preto'>{element.friendName.toUpperCase()}</Link>
                                <Link to="/user" state={{ iduser: element.friendId }} className='text-preto text-xl'>{element.friendUsername}</Link>
                            </div>
                            <div className='flex flex-col'>
                                <h1 className='text-xl text-preto font-semibold'>{element.notificationTitle}</h1>
                                <h1 className='text-lg text-preto'>{element.notificationBody}</h1>
                            </div>
                        </div>
                    )
                } else {
                    olderArray.push(
                        <div className='flex w-full items-center my-3'>
                            <img className='w-[70px] h-[70px] rounded-full object-cover' src={element.image} alt="User Profile Pic" />
                            <div className='flex flex-col mx-7'>
                                <Link to="/user" state={{ iduser: element.friendId }} className='text-xl font-semibold text-preto'>{element.friendName}</Link>
                                <Link to="/user" state={{ iduser: element.friendId }} className='text-preto text-xl'>{element.friendUsername}</Link>
                            </div>
                            <div className='flex flex-col'>
                                <h1 className='text-xl text-preto font-semibold'>{element.notificationTitle}</h1>
                                <h1 className='text-lg text-preto'>{element.notificationBody}</h1>
                            </div>
                        </div>
                    )
                }
            });

            setUserNotificationsThisWeek(thisWeekArray);
            setUserNotificationsThisMonth(thisMonthArray);
            setUserNotificationsOlder(olderArray);

            setUserNotificationsIdThisWeek(thisWeekIdArray);
            setUserNotificationsIdThisMonth(thisMonthIdArray);
            setUserNotificationsIdOlder(olderIdArray)

        }

        if (userNotifications) {
            handleNotifications();
        }

    }, [userNotifications])

    return (
        <section className='flex w-full  py-20'>
            <div className='w-[50vw] border-r-2 border-preto/60 h-[75vh] px-16 overflow-auto scrollbar'>
                {
                    (userNotificationsThisWeek == '' && userNotificationsThisMonth == '' && userNotificationsOlder == '') &&
                    <div className='mt-40 flex w-full justify-center text-xl text-preto'>NO NEW NOTIFICATIONS</div>
                }
                <div className='flex flex-col w-full pb-28'>
                    <h1 className='text-preto text-2xl font-bold py-5'>{userNotificationsThisWeek != '' && "THIS WEEK"}</h1>
                    <div className='w-full flex flex-col'>
                        {userNotificationsThisWeek}
                    </div>
                </div>
                <div className='flex flex-col w-full pb-28'>
                    <h1 className='text-preto text-2xl font-bold'>{userNotificationsThisMonth != '' && "THIS MONTH"}</h1>
                    <div className='w-full flex flex-col'>
                        {userNotificationsThisMonth}
                    </div>
                </div>
                <div className='flex flex-col w-full pb-28'>
                    <h1 className='text-preto text-2xl font-bold'>{userNotificationsOlder != '' && "LATER"}</h1>
                    {userNotificationsOlder}
                </div>

               

            </div>

            <div className='left-[50vw] w-[50vw] px-16 max-h-[75vh] overflow-y-scroll scrollbar'>
                <h1 className='text-preto text-2xl font-bold py-5'>LATEST NEWS</h1>
                {newsArticlesDivs != '' && newsArticlesDivs}
            </div>

        </section>
    )
}

export default Notifications