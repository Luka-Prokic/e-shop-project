import Container from "../container_comp/Container";
import React from "react";
import { ButtonStyle, ConStyle, ConType, InputType, Size } from "../helpers/compInterface";
import Buy from "../button_comp/Buy";
import { Product } from "../helpers/Products";
import Card from "../card_comp/Card";


const CardsRoot = () => {
    return ( <>
        <Container>
            <Card product={new Product(53, "https://eshop.wurth.rs/images/thumbs/1486364_pur-pena-niskoekspandirajuca-750mlwebp_350.webp", 100, 10)}>
                <Buy style={ButtonStyle.BUBBLE}>ADD</Buy>
                <p>
                    Shy resolution instrument unreserved man few. She did open find pain some out. If we landlord stanhill mr whatever pleasure supplied concerns so. Exquisite by it admitting cordially september newspaper an. Acceptance middletons am it favourable. It it oh happen lovers afraid.
                </p>
            </Card>
            <Card product={new Product(59, "https://eshop.wurth.rs/images/thumbs/1254909_wurth-mix-set-rucnog-alata-102-kom_350.webp", 200, 15)}>
                <Buy>ADD</Buy>
                <p>
                    Shy resolution instrument unreserved man few. She did open find pain some out. If we landlord stanhill mr whatever pleasure supplied concerns so. Exquisite by it admitting cordially september newspaper an. Acceptance middletons am it favourable. It it oh happen lovers afraid.
                </p>
            </Card>
            <Card product={new Product(51, "https://eshop.wurth.rs/images/thumbs/0736066_rost-off-ice-plus-odvijac-u-spreju-400-ml_350.webp", 50, 20)}>
                <Buy>ADD</Buy>
                <p>
                    Shy resolution instrument unreserved man few. She did open find pain some out. If we landlord stanhill mr whatever pleasure supplied concerns so. Exquisite by it admitting cordially september newspaper an. Acceptance middletons am it favourable. It it oh happen lovers afraid.
                </p>
            </Card>
            <Card product={new Product(247, "https://eshop.wurth.rs/images/thumbs/1750128_nitril-strong-narandzaste-rukavice_350.webp", 20, 5)}>
                <Buy>ADD</Buy>
                <p>
                    Shy resolution instrument unreserved man few. She did open find pain some out. If we landlord stanhill mr whatever pleasure supplied concerns so. Exquisite by it admitting cordially september newspaper an. Acceptance middletons am it favourable. It it oh happen lovers afraid.
                </p>
            </Card>
        </Container>

        <Container>
            <Card product={new Product(233, "https://eshop.wurth.rs/images/thumbs/0736066_rost-off-ice-plus-odvijac-u-spreju-400-ml_350.webp", 100, 10)}>
                <Buy>ADD</Buy>
                <p>
                    Shy resolution instrument unreserved man few. She did open find pain some out. If we landlord stanhill mr whatever pleasure supplied concerns so. Exquisite by it admitting cordially september newspaper an. Acceptance middletons am it favourable. It it oh happen lovers afraid.
                </p>
            </Card>
            <Card product={new Product(221, "https://eshop.wurth.rs/images/thumbs/1486364_pur-pena-niskoekspandirajuca-750mlwebp_350.webp", 50, 30)}>
                <Buy>BUY</Buy>
                <p>
                    Him rendered may attended concerns jennings reserved now. Sympathize did now preference unpleasing mrs few. Mrs for hour game room want are fond dare. For detract charmed add talking age.
                </p>
            </Card>
            <Card product={new Product(217, "https://eshop.wurth.rs/images/thumbs/1750128_nitril-strong-narandzaste-rukavice_350.webp", 20, 5)}>
                <Buy />
                <p>
                    Pianoforte solicitude so decisively unpleasing conviction is partiality he. Or particular so diminution entreaties oh do. Real he me fond show gave shot plan. Mirth blush linen small hoped way its along. Resolution frequently apartments off all discretion devonshire. Saw sir fat spirit seeing valley. He looked or valley lively. If learn woody spoil of taken he cause.
                </p>
            </Card>
            <Card product={new Product(259, "https://eshop.wurth.rs/images/thumbs/1254909_wurth-mix-set-rucnog-alata-102-kom_350.webp", 300, 25)}>
                <Buy style={ButtonStyle.JAVA} />
                <p>
                    Pianoforte solicitude so decisively unpleasing conviction is partiality he. Or particular so diminution entreaties oh do. Real he me fond show gave shot plan. Mirth blush linen small hoped way its along. Resolution frequently apartments off all discretion devonshire. Saw sir fat spirit seeing valley. He looked or valley lively. If learn woody spoil of taken he cause.
                </p>
            </Card>
        </Container>

    </>)
}

export default CardsRoot;