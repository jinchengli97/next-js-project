import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";
import MeetupList from "../components/meetups/MeetupList";
// import { useState, useEffect } from "react";

function HomePage(props) {
  //   const [loadedMeetups, setLoadedMeetups] = useState([]);

  //   useEffect(() => {
  //     // send a heep request and fetch data
  //     setLoadedMeetups(DUMMY_MEETUPS);
  //   }, []);

  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="Browse a list of highly active React meetups and share with you group"></meta>
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

// getStaticProps will be call first before the component function as a reserved keyword in Next.js
// will not end up on the client side
export async function getStaticProps() {
  // fetch data from an API
  // always return an object
  // revalidate will regenerate page every k seconds
  const client = await MongoClient.connect(
    "mongodb+srv://admin:admin@cluster0.iqukz.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   // run on server, fetch data from api etc.
//   // pre generated for every request
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export default HomePage;
