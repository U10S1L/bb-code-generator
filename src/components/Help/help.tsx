import React from "react";
import { OverlayTrigger, Button, Card } from "react-bootstrap";

type Props = {
    title: string;
    text: string;
};

const Help = (props: Props) => {
    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
                <Card style={{ width: "18rem" }}>
                    <Card.Body>
                        <Card.Title>{props.title}</Card.Title>
                        <Card.Text>{props.text}</Card.Text>
                    </Card.Body>
                </Card>
            }>
            <Button
                variant="info"
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    zIndex: 1
                }}>
                Help
            </Button>
        </OverlayTrigger>
    );
};

export default Help;
