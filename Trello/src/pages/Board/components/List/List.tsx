import type { IList } from "../../../../common/interfaces/IList.ts";
import CardComponent from "../Card/Card.tsx";

function List({ title, cards, id }: IList) {

    return (
        <div className={"list_class"}>
            <div className={"list"+id}>
                <h3 className="list__title">{title}</h3>

                <div className="list__cards">
                    {cards?.map(card => (
                        <CardComponent key={card.id} title={card.title} />
                    ))}
                </div>
            </div>
        </div>
    );
}
export default List;