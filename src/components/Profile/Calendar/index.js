import React, { useEffect, useState } from 'react';
import { db, storage, auth } from '../../../firebase';
import { doc, getDoc, query, collection, updateDoc, where, getDocs, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { SlArrowRight } from "react-icons/sl"
import { SlArrowLeft } from "react-icons/sl"
import { RxCross1 } from 'react-icons/rx'


const Calendar = () => {

    const [date, setDate] = useState(new Date());
    const [monthName, setMonthName] = useState('');
    const [entriesTracks, setEntriesTracks] = useState([]);
    const [entriesTracksId, setEntriesTracksId] = useState([]);
    const [entriesTracksDay, setEntriesTracksDay] = useState([]);
    const [entriesTracksImage, setEntriesTracksImage] = useState([]);
    const [entriesTracksDocId, setEntriesTracksDocId] = useState([]);
    const [renderDays, setRenderDays] = useState([]);
    const [selectedToDelete, setSelectedToDelete] = useState([]);
    const [modalDelete, setModalDelete] = useState('hidden');

    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const [userId, setUserId] = useState(null);
    const [name, setName] = useState("");
    const [ready, setReady] = useState(0);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const getUserId = async () => {
                    const userSearchId = await auth.currentUser.uid;
                    setUserId(userSearchId)
                    getUserInfo();
                }
                getUserId();
                calendarWrite();
            }
        });
    }, []);

    const getUserInfo = async () => {
        const userLoggedInfo = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const data = userLoggedInfo.data();
        setName(data.name);
    }

    const modalDeleteFunction = () => {
        if (modalDelete == 'hidden') {
            setModalDelete('h-screen w-screen bg-black/60 z-[1000] flex fixed left-0 top-0 justify-center items-center')
        } else {
            setModalDelete('hidden');
        }
    }

    const deleteFromCalendar = async () => {

        console.log(selectedToDelete)
        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/calendar`, selectedToDelete));

    }

    const handlePrevClick = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1));
    };

    const handleNextClick = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1));
    };

    const calendarWrite = async () => {

        var entriesTracksArray = [];
        var entriesTracksIdArray = [];
        var entriesTracksDayArray = [];
        var entriesTracksImageArray = [];
        var entriesTracksDocIdArray = [];

        const calendarRef = collection(db, `users/${auth.currentUser.uid}/calendar`);

        const entries = await getDocs(query(calendarRef, where("month", "==", date.getMonth()), where("year", "==", date.getFullYear()), orderBy("day", "asc")));
        entries.forEach((doc) => {
            entriesTracksDocIdArray.push(doc.id);
            entriesTracksArray.push(doc.data().track);
            entriesTracksIdArray.push(doc.data().idTrack);
            entriesTracksDayArray.push(doc.data().day)
            entriesTracksImageArray.push(doc.data().image)
        });

        setEntriesTracksDocId(entriesTracksDocIdArray);
        setEntriesTracks(entriesTracksArray);
        setEntriesTracksId(entriesTracksIdArray);
        setEntriesTracksDay(entriesTracksDayArray);
        setEntriesTracksImage(entriesTracksImageArray);

    }

    useEffect(() => {

        const days = [];
        var daysTrue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<td key={i} />);
        }

        for (let i = 0; i < daysInMonth; i++) {

            entriesTracksDay.map((element, index) => {
                if (element == i) {
                    daysTrue.splice(i, 1, entriesTracksDocId[index]);
                }
            })

        }

        var contador = 0;
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(
                <td className='col-span-1 px-3 border-[1px] border-preto/50 hover:border-preto text-xl text-preto/50 hover:text-preto h-[13rem] flex flex-col' key={i}>
                    <div className='text flex h-[30%]'>{i} {daysTrue[i] == 1 && entriesTracks[contador]}</div> <div className='group flex w-full justify-center items-center pt-2'>
                        {daysTrue[i] != 0 &&
                            <>
                                <img className='w-[7rem]' src={entriesTracksImage[contador]} />
                                <button className='text-cinza hidden group-hover:flex justify-center absolute w-[7rem] h-[7rem] items-center bg-preto/70  cursor-pointer' onClick={() => { setSelectedToDelete(daysTrue[i]); modalDeleteFunction() }}>
                                    <RxCross1 className=' text-2xl'></RxCross1>
                                </button>
                            </>
                        }
                    </div>
                </td>
            );
            if (daysTrue[i] != 0) {
                contador++;
            }

        }

        setRenderDays(days);

    }, [entriesTracks, date]);

    useEffect(() => {

        switch (date.getMonth()) {

            case 0:
                setMonthName("JANUARY");
                break;
            case 1:
                setMonthName("FEBRUARY");
                break;
            case 2:
                setMonthName("MARCH");
                break;
            case 3:
                setMonthName("APRIL");
                break;
            case 4:
                setMonthName("MAY");
                break;
            case 5:
                setMonthName("JUNE");
                break;
            case 6:
                setMonthName("JULY");
                break;
            case 7:
                setMonthName("AUGUST");
                break;
            case 8:
                setMonthName("SEPTEMBER");
                break;
            case 9:
                setMonthName("OCTOBER");
                break;
            case 10:
                setMonthName("NOVEMBER");
                break;
            case 11:
                setMonthName("DECEMBER");
                break;

        }

    }, [date])

    return (
        <section>
            <section className='px-10'>
                <div className="flex items-center justify-center  pb-10">
                    <button onClick={handlePrevClick} className="text-2xl px-5 pt-2"><SlArrowLeft /></button>
                    <h5 className="text-preto text-xl font-bold">{monthName}</h5>
                    <button onClick={handleNextClick} className="text-2xl px-5 pt-2"><SlArrowRight /></button>
                </div>
                <table className='w-full'>
                    <thead className='w-full'>
                        <tr className='grid grid-cols-7 w-full text-center text-preto text-xl'>
                            <th className='col-start-1 col-span-1 p-5'>SU</th>
                            <th className='col-start-2 col-span-1 p-5'>MO</th>
                            <th className='col-start-3 col-span-1 p-5'>TU</th>
                            <th className='col-start-4 col-span-1 p-5'>WE</th>
                            <th className='col-start-5 col-span-1 p-5'>TH</th>
                            <th className='col-start-6 col-span-1 p-5'>FR</th>
                            <th className='col-start-7 col-span-1 p-5'>SA</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='grid grid-cols-7 w-full'>
                            {renderDays}
                        </tr>
                        <div className={modalDelete}>
                            <div className='bg-preto w-[30vw] h-auto shadow-2xl flex flex-col justify-center text-center items-center rounded-xl p-8'>
                                <h1 className='text-cinza'>ARE YOU SURE YOU WANT TO REMOVE THIS ITEM FROM YOUR BOOKLET?</h1>
                                <div className='flex justify-center items-center m-5'>
                                    <button type='button' className='mr-2 py-2 px-5  w-[5rem] rounded-full bg-amarelo text-xl text-preto outline-none ' onClick={() => { modalDeleteFunction(); deleteFromCalendar(); calendarWrite() }}>Yes</button>
                                    <button type='button' className='ml-2 py-2 px-5  w-[5rem] rounded-full bg-amarelo text-xl text-preto outline-none ' onClick={() => { modalDeleteFunction(); }}>No</button>
                                </div>
                            </div>
                        </div>
                    </tbody>
                </table>
            </section>
        </section>
    );
}

export default Calendar;
