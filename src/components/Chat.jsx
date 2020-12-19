import React, {useState} from "react";
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation} from "@apollo/client";
import {Col, Container, FormInput, Row, Button} from "shards-react";
import userEvent from "@testing-library/user-event";

const client = new ApolloClient({
    uri: "http://localhost:4000/",
    cache: new InMemoryCache()
});

const GET_MESSAGES = gql`
    query{
        messages{
            id,
            user,
            content
        }
    }
`

const POST_MESSAGE = gql`
    mutation ($user: String!, $content: String!){
        postMessage(user: $user, content: $content)
    }
`

const Messages = ({user}) => {
    const {data} = useQuery(GET_MESSAGES, {
        pollInterval: 500
    });

    if (!data)
        return null

    return (
        <>
            {data.messages.map(({id, user: messageUser, content}) => (
                    <div style={{
                        display: "flex",
                        justifyContent: user === messageUser ? 'flex-end' : 'flex-start',
                        paddingBottom: "1em"
                    }}>
                        {
                            user !== messageUser && (
                                <div style={{
                                    height: 50,
                                    width: 50,
                                    marginRight: "0.5em",
                                    border: '2px solid #e5e6ea',
                                    borderRadius: "50%",
                                    textAlign: "center",
                                    fontSize: "18pt",
                                    paddingTop: "5"
                                }}>{messageUser.slice(0, 2).toUpperCase()}</div>
                            )
                        }
                        <div style={{
                            background: user === messageUser ? "#58bf56" : "#e5e6ea",
                            color: user === messageUser ? "white" : "black",
                            padding: "1em",
                            borderRadius: "1em",
                            maxWidth: "60%"
                        }}>
                            {content}
                        </div>
                    </div>
                )
            )
            }
        </>
    )

}

const Chat = () => {
    const [userState, setUserState] = useState({
        user: "Vijay",
        content: ""
    })
    const [postMessage] = useMutation(POST_MESSAGE)


    const onSend = () => {
        if (userState.content.length > 0) {
            postMessage({
                variables: userState
            })
        }
        setUserState({
            ...userState,
            content: ''
        })
    }

    return <Container><Messages user="Vijay"/>
        <Row>
            <Col xs={2} style={{padding: "0"}}>
                <FormInput label="User" value={userState.user} onChange={(evt) => {
                    setUserState({
                        ...userState,
                        user: evt.target.value
                    })
                }}/>
            </Col>
            <Col xs={8}>
                <FormInput label="Message" value={userState.content} onChange={(evt) => {
                    setUserState({
                        ...userState,
                        content: evt.target.value
                    })
                }}/>
                <Button onClick={() => onSend()}>Send</Button>
            </Col>
        </Row></Container>
}

export default () => (
    <ApolloProvider client={client}>
        <Chat/>
    </ApolloProvider>
)
