import React, { Component } from 'react'
import '../css/Home.css'
import '../css/Common.css'
import * as menus from '../constant/Menus'

class Home extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        document.title = "Universal Good Shop";
        this.props.setMenuCode(menus.HOME);
    }

    render() {
        return (
            <div className="section-container">
                <h2>Home Page</h2>
                <p>{this.props.content}</p>
                <h2 style={{textAlign:"center"}}>Tanpo Waton</h2>
                <p style={{textAlign:"center"}}>Ngawiti ingsun nglaras syi’iran # Kelawan muji maring pengeran<br />
                    Kang paring rohmat lan kenikmatan # Rino wengine tanpo pitungan<br />
                    Duh bolo konco priyo wanito # Ojo mung ngaji syare’at bloko<br />
                    Gur pinter dongeng nulis lan moco # Tembe mburine bakal sangsoro<br />
                    Akeh kang apal Qur’an hadise # Seneng ngafirke marang liyane<br />
                    Kafire dewe ndak digatekke # Yen isih kotor ati akale<br />
                    Gampang kabujuk nafsu angkoro # Ing pepaese gebyare donyo<br />
                    Iri lan meri sugihe tonggo # Mulo atine peteng lan nisto<br />
                    Ayo sedulur jo nglaleake # Wajibe ngaji sa’pranatane<br />
                    Nggo ngandelake iman tauhide # Baguse sangu mulyo matine<br />
                    Kang aran sholeh bagus atine # Kerono mapan seri ngelmune<br />
                    Laku thoriqat lan ma’rifate # Ugo haqiqot manjing rasane<br />
                    Al-Qur’an qodim wahyu minulyo # Tanpo tinulis iso diwoco<br />
                    Iku wejangan guru waskito # Den tancepaken ing jero dodo<br />
                    Kumantil ati lan pikiran # Mrasuk ing badan kabeh jeroan<br />
                    Mukjizat Rosul dadi pedoman # Minongko dalan manjinge iman<br />
                    Kelawan Alloh kang moho suci # Kudu rangkulan rino lan wengi<br />
                    Ditirakati diriyadhahi # Dzikir lan suluk jo nganti lali<br />
                    Uripe ayem rumongso aman # Dununge roso tondo yen iman<br />
                    Sabar narimo nadjan pas-pasan # Kebeh tinakdir saking pengeran<br />
                    Kelawan konco dulur lan tonggo # Kang podo rukun ojo dursilo<br />
                    Baca Juga :  Perpustakaan dan Air Mata Gus Dur<br />
                    Iku sunnahe rosul kang mulyo # Nabi Muhammad panutan kito<br />
                    Ayo nglakoni sekabahane  # Alloh kang bakal ngangkat drajate<br />
                    Senajan asor toto dzohire # Ananging mulyo maqom drajate<br />
                    Lamun palastro ing pungkasane # Ora kesasar roh lan sukmane<br />
                    Den gadang Alloh swargo manggone # Utuh mayite ugo ulese </p>
            </div>
        );
    }
}

export default Home;