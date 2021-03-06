import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';
import { Fragment } from 'react';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta
                name="description"
                content={props.meetupData.description}
                />
                <MeetupDetail 
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
                />
            </Head>
        </Fragment>
        
       
    );
}

export async function getStaticPaths() {
    const client = await MongoClient.connect(
        'mongodb+srv://Leticia:Pm8E8nOI7wZvfS7N@cluster0.uznpi.mongodb.net/meetups?retryWrites=true&w=majority'
      );
      const db = client.db();
    
      const meetupsCollection = db.collection('meetups');
    
      const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();

      client.close();

    return {
        fallback: 'blocking',
        paths: meetups.map((meetups) => ({
            params: {
                meetupId: meetups._id.toString()
            },
        })),
    };
}

export async function getStaticProps(context) {
    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect(
        'mongodb+srv://Leticia:Pm8E8nOI7wZvfS7N@cluster0.uznpi.mongodb.net/meetups?retryWrites=true&w=majority'
      );
      const db = client.db();
    
      const meetupsCollection = db.collection('meetups');
    
      const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)});

      client.close();

    return (
        
        {           
            props: {
                meetupData: {
                    id: selectedMeetup._id.toString(),
                    title: selectedMeetup.title,
                    address: selectedMeetup.address,
                    image: selectedMeetup.image,
                    description: selectedMeetup.description
                }
            }
        }
    );

}

export default MeetupDetails;