interface CardProps {
    title: string;
}

function Card({ title }: CardProps) {
    return <div className="card">{title}</div>;
}

export default Card;