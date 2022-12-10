const touNodes = [
  {
    className: 'maintitle',
    text: '《AI牙小程序用户协议》',
  },
  {
    className: 'title',
    text: '重要提示：',
  },
  {
    className: 'para',
    text: '您通过北京基骨智能科技有限公司（以下简称“基骨智能”）的AI牙小程序（以下简称“小程序”）进行患者管理及使用其他功能之前，请您务必审慎阅读、充分理解本协议各条款内容，包括但不限于免除或者限制责任的条款。如您不同意本协议及/或随时对其的调整修订，您可以主动停止使用系统提供的服务。您一旦访问并使用本系统服务，即表示您已接受并完全同意本协议各项内容（包括基骨对服务协议随时所做的任何修改），并成为基骨用户。基骨可随时修订本协议。您接受修订版《用户协议》的约束，因此应定期访问本页面，仔细阅读您须遵守的最新有效条款。',
  },
  {
    className: 'title',
    text: '一、总则',
  },
  {
    className: 'para',
    text: `1.1 您可以选择同意本协议的条款并按照页面上的提示完成全部的授权程序。您在进行授权程序中点击“允许”按钮或勾选'同意'按钮即表示您与基骨达成协议，完全接受本协议项下的全部条款。`,
  },
  {
    className: 'para',
    text: `1.2“您”指所有直接或间接获取和使用基骨及相关服务的使用者，包括自然人、法人和其他组织等。在本协议中统称为“您”。`,
  },
  {
    className: 'title',
    text: '二、授权信息与隐私保护',
  },
  {
    className: 'para',
    text: `2.1 在您完成授权程序或以其他基骨许可的方式实际使用服务时，您应当是具备完全民事权利能力和与所从事的民事行为相适应的行为能力的自然人、法人或其他组织。若您不具备前述主体资格，请勿使用服务，否则您及您的监护人应承担因此而导致的一切后果，且基骨有权注销（永久冻结）您的账户，并向您及您的监护人索偿。`,
  },
  {
    className: 'para',
    text: `2.2 经基骨小程序完成授权成为基骨的授权用户，即获得基骨授权用户所应享有的一切权限；基骨有权对您所享有的相关权限进行变更。`,
  },
  {
    className: 'para',
    text: `2.3 除本协议及《隐私协议》注明之服务条款外，其他一切因使用基骨服务而引致之意外、疏忽、合约毁坏、诽谤、版权或其他知识产权侵犯及其所造成的损失，基骨概不负责，亦不承担任何法律责任。
    `,
  },
  {
    className: 'title',
    text: '三、使用规则',
  },
  {
    className: 'para',
    text: `3.1 您在使用基骨的服务时，必须遵守《网络安全法》、《计算机信息网络国际联网安全保护管理办法》、《互联网信息服务管理办法》、《个人信息保护法》、《互联网电子公告服务管理规定》、《维护互联网安全的决定》、《互联网新闻信息服务管理规定》等中华人民共和国相关法律法规的规定，您应同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为:
    `,
  },
  {
    className: 'para',
    text: `（1）上载、展示、张贴、传播或以其他方式传送含有下列内容之一的信息：`,
  },
  {
    className: 'paraindent',
    text: `1）反对宪法所确定的基本原则的；`,
  },
  {
    className: 'paraindent',
    text: `2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；`,
  },
  {
    className: 'paraindent',
    text: `3）损害国家荣誉和利益的；`,
  },
  {
    className: 'paraindent',
    text: `4）煽动民族仇恨、民族歧视、破坏民族团结的；`,
  },
  {
    className: 'paraindent',
    text: `5）破坏国家宗教政策，宣扬邪教和封建迷信的；`,
  },
  {
    className: 'paraindent',
    text: `6）散布谣言，扰乱社会秩序，破坏社会稳定的；`,
  },
  {
    className: 'paraindent',
    text: `7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；`,
  },
  {
    className: 'paraindent',
    text: `8）侮辱或者诽谤他人，侵害他人合法权利的；`,
  },
  {
    className: 'paraindent',
    text: `9）含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、其他道德上令人反感的内容；`,
  },
  {
    className: 'paraindent',
    text: `10）含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其他内容。`,
  },
  {
    className: 'para',
    text: `基骨负责对系统上注册用户发布的内容进行监督，发现不符合本原则规定的内容，基骨有权给予屏蔽或删除，并保留对不符合规定言论进行处理而不通知发布者的权利。`,
  },
  {
    className: 'para',
    text: `（2）不得为任何非法目的而使用网络服务系统；`,
  },
  {
    className: 'para',
    text: `（3）不利用基骨的服务从事以下活动：`,
  },
  {
    className: 'paraindent',
    text: `1）未经允许，进入计算机信息网络或者使用计算机信息网络资源的；`,
  },
  {
    className: 'paraindent',
    text: `2）未经允许，对计算机信息网络功能进行删除、修改或者增加的；`,
  },
  {
    className: 'paraindent',
    text: `3）未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；`,
  },
  {
    className: 'paraindent',
    text: `4）故意制作、传播计算机病毒等破坏性程序的；`,
  },
  {
    className: 'paraindent',
    text: `5）其他危害计算机信息网络安全的行为。`,
  },
  {
    className: 'para',
    text: `3.2 您不得对本服务任何部分或本服务之使用或获得，进行复制、拷贝、出售、转售或用于任何其他商业目的。`,
  },
  {
    className: 'para',
    text: `3.3 您须对自己在使用基骨服务过程中的行为承担法律责任。您承担法律责任的形式包括但不限于：对受到侵害者进行赔偿，以及在基骨首先承担了因您行为导致的行政处罚或侵权损害赔偿责任后，您应给予基骨等额的赔偿。`,
  },
  {
    className: 'para',
    text: `3.4 您在使用基骨服务时遵守以下互联网底线：`,
  },
  {
    className: 'paraindent',
    text: `1）法律法规底线；`,
  },
  {
    className: 'paraindent',
    text: `2）社会主义制度底线；`,
  },
  {
    className: 'paraindent',
    text: `3）国家利益底线；`,
  },
  {
    className: 'paraindent',
    text: `4）公民合法权益底线；`,
  },
  {
    className: 'paraindent',
    text: `5）社会公共秩序底线；`,
  },
  {
    className: 'paraindent',
    text: `6）道德风尚底线；`,
  },
  {
    className: 'paraindent',
    text: `7）信息真实性底线；`,
  },
  {
    className: 'para',
    text: `3.5 非经中华人民共和国主管机关批准，境内的组织、个人不得向外国司法或者执法机构提供存储于中华人民共和国境内的数据，若利用基骨小程序收集数据并进行非法传播的，基骨将配合司法机关完成调查，导致基骨被予以行政处罚的，您应给予基骨等额赔偿。`,
  },
  {
    className: 'em',
    text: `3.6 本系统非医疗器械，其安全性和有效性未经过验证，不能应用于临床。`,
  },
  {
    className: 'em',
    text: `3.7 本系统中上传所有除用户外第三方任何信息需要经过第三方同意，禁止将未经过许可的第三方信息导入本系统。由此引起的患者隐私相关的纠纷，基骨不承担任何责任。`,
  },
  {
    className: 'title',
    text: '四、服务内容',
  },
  {
    className: 'para',
    text: `4.1 基骨服务的具体内容基骨根据实际情况提供。`,
  },
  {
    className: 'para',
    text: `4.2 您应自行承担因使用服务所产生的费用，包括但不限于上网流量费、通信服务费等。`,
  },
  {
    className: 'para',
    text: `4.3 除非本协议另有其他规定，基骨所推出的新功能、新服务，均受到本协议之规范。`,
  },
  {
    className: 'para',
    text: `4.4 为使用本服务，您必须经有合法资质可提供互联网接入服务的第三方平台进入国际互联网，并应自行支付相关服务费用。此外，您必须自行配备并提供与国际联网连线所需之一切必要装备，包括计算机、数据机或其他存取装置。`,
  },
  {
    className: 'para',
    text: `4.5 鉴于网络服务的特殊性，您同意基骨有权不经事先通知随时变更、中断或存储部分或全部的网络服务（包括收费网络服务）。基骨不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不做担保。`,
  },
  {
    className: 'para',
    text: `4.6 基骨有权于任何时间暂时或永久性的修改或存储本服务（或其任何部分），而无论其通知与否，基骨对您和任何第三人均不承担任何责任。`,
  },
  {
    className: 'para',
    text: `4.7 您充分了解并同意，您必须为自己授权帐号下的一切行为负责，包括您所发表的任何内容以及由此产生的任何后果。您应对使用本服务时接触到的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。基骨无法且不会对您因前述风险而导致的任何损失或损害承担责任。`,
  },
  {
    className: 'para',
    text: `4.8 如果基骨发现或收到他人举报您有违反本协议约定的，基骨有权依照相关法律法规的规定对相关举报内容核实、转通知以及删除、屏蔽等措施，以及采取包括但不限于收回帐号，限制、暂停、终止您使用部分或全部本服务，追究法律责任等措施。`,
  },
  {
    className: 'title',
    text: '五、第三方应用及服务',
  },
  {
    className: 'para',
    text: `5.1 基骨可能允许第三方应用接入基骨小程序以便您选购开通、管理和使用第三方应用。`,
  },
  {
    className: 'para',
    text: `5.2 您了解并同意，基骨仅作为平台提供者，基骨仅为了您便利操作而提供该功能模块或服务订购和/或使用入口，相关应用由该第三方独立提供，除法律法规和本协议另有规定外，基骨不对您对该应用的使用承担任何责任。`,
  },
  {
    className: 'para',
    text: `5.3 您了解并同意，除法律另有明确规定外，如基骨对基骨服务及第三方服务作出调整、中止或终止而对第三方应用服务产生影响的，基骨不承担相应责任。`,
  },
  {
    className: 'para',
    text: `5.4 您通过第三方应用或服务使用基骨时，基骨可能会调用第三方系统或者通过第三方平台支持您的使用或访问，使用或访问的结果由该第三方提供。`,
  },
  {
    className: 'para',
    text: `5.5 您理解并同意，您在使用基骨服务中的第三方应用及服务时，除遵守本协议的约定外，还应遵守第三方协议；为实现第三方应用及服务，企业/机构服务管理员基于企业/机构组织授权选择开通第三方服务。`,
  },
  {
    className: 'title',
    text: '六、知识产权',
  },
  {
    className: 'para',
    text: `6.1 您了解及同意，除非基骨另行声明，本协议项下服务包含的所有产品、技术、软件、程序、数据及其他信息（包括但不限于文字、图像、图片、照片、图表、色彩、版面设计、电子文档）的所有知识产权（包括但不限于版权、商标权、专利权、商业秘密等）及相关权利均归基骨或其关联公司所有。`,
  },
  {
    className: 'para',
    text: `6.2 您应保证，除非取得基骨的书面授权，对于上述权利您不得（并不得允许任何第三人）实施包括但不限于出租、出借、出售、散布、复制、修改、转载、汇编、发表、出版、还原工程、反向汇编、反向编译，或以其他方式发现原始码等的行为。`,
  },
  {
    className: 'para',
    text: `6.3 基骨的LOGO、“基骨”等文字、图形及其组合，以及基骨其他标识、徽记、基骨服务的名称等为基骨及其关联公司在中国和其他国家的注册商标。未经基骨书面授权，任何人不得以任何方式展示、使用或做其他处理（包括但不限于复制、传播、展示、镜像、上传、下载），也不得向他人表明您有权展示、使用或做其他处理。`,
  },
  {
    className: 'para',
    text: `6.4 基骨所有的产品、服务、技术与所有应用程序或其组件/功能/名称（以下或简称“技术服务”）的知识产权均归属于基骨所有或归其权利人所有。`,
  },
  {
    className: 'para',
    text: `6.5 您理解并同意授权基骨在宣传和推广中使用您的名称、商标、标识，但仅限于表明您属于我们的客户或合作伙伴。`,
  },
  {
    className: 'title',
    text: '七、责任承担',
  },
  {
    className: 'bold',
    text: `7.1 未经过第三方书面同意将第三方信息上传至本系统或用于临床导致或产生任何第三方主张的索赔、要求或损失（包括律师费等合理费用），基骨对您或任何第三人不承担任何责任。对此，基骨有权回收其帐号。同时，基骨会视司法部门的要求，协助调查。`,
  },
  {
    className: 'para',
    text: `7.2 您违反本协议或《隐私政策》条款的规定，导致或产生的任何第三方主张的索赔、要求或损失（包括律师费等合理费用），您同意赔偿基骨并使之免受损害。对此，基骨有权视您的行为性质，采取包括但不限于删除您发布信息内容、暂停使用许可、存储服务、限制使用、回收帐号、追究法律责任等措施。对恶意授权基骨帐号或利用基骨帐号进行违法活动、捣乱、骚扰、欺骗其他您以及其他违反本协议的行为，基骨有权回收其帐号。同时，基骨会视司法部门的要求，协助调查。`,
  },
  {
    className: 'para',
    text: `7.3 您须对自己在使用基骨系统过程中的行为承担法律责任。您承担法律责任的形式包括但不限于：对受到侵害者进行赔偿，以及在基骨首先承担了因您行为导致的行政处罚或侵权损害赔偿责任后，您应给予基骨等额的赔偿。`,
  },
  {
    className: 'para',
    text: `7.4 终止服务`,
  },
  {
    className: 'para',
    text: `您同意基骨的基于其自行之考虑，因任何理由，包含但不限于长时间（超过一年）未使用，或基骨认为您已经违反本服务协议的文字及精神，终止您的帐号或本服务之使用（或服务之任何部分），并将您在本服务内任何内容加以移除并删除。您同意依本服务协议任何规定提供之本服务，无需进行事先通知即可中断或终止，您承认并同意，基骨可立即关闭或删除您的帐号及您帐号中所有相关信息及文件，及/或禁止继续使用前述文件或本服务。此外，您同意若本服务之使用被中断或终止或您的帐号及相关信息和文件被关闭或删除，基骨对您或任何第三人均不承担任何责任。`,
  },
  {
    className: 'para',
    text: `7.5 您同意，由于您通过服务上载、传送或分享之信息、使用本服务其他功能、违反本协议、或您侵害他人任何权利因而衍生或导致任何第三人向基骨及其关联公司提出任何索赔或请求，或基骨及其关联公司因此而发生任何损失，您同意将足额进行赔偿（包括但不限于合理律师费）。`,
  },
  {
    className: 'para',
    text: `7.6 系统非医疗器械，输出结果仅供参考，授权用户在本系统所提供的咨询服务仅为操作指导建议，其中内容仅供参考，请结合临床，不作为诊断依据，基骨不能对您最终输出结果的正确性进行保证。`,
  },
  {
    className: 'para',
    text: `7.7 您在系统发表的内容仅表明其个人的立场和观点，并不代表基骨的立场或观点。作为内容的发表者，需自行对所发表内容负责，因所发表内容引发的一切纠纷，由该内容的发表者承担全部法律及连带责任。基骨不承担任何法律及连带责任。`,
  },
  {
    className: 'para',
    text: `7.8 系统不保证网络服务一定能满足您的要求，也不保证网络服务不会中断，对网络服务的及时性、安全性、准确性也都不做保证。`,
  },
  {
    className: 'para',
    text: `7.9 对于因不可抗力或基骨不能控制的原因造成的网络服务中断或其他缺陷，基骨不承担任何责任，但将尽力减少因此而给您造成的损失和影响。`,
  },
  {
    className: 'para',
    text: `7.10 因以下情况造成网络服务在合理时间内的中断，基骨无需为此承担任何责任；`,
  },
  {
    className: 'para',
    text: `（1）基骨需要定期或不定期地对提供网络服务的平台或相关的设备进行检修或者维护，基骨保留不经事先通知为维修保养、升级或其他目的暂停本服务任何部分的权利。`,
  },
  {
    className: 'para',
    text: `（2）因台风、地震、洪水、雷电、疫情或恐怖袭击等不可抗力原因；`,
  },
  {
    className: 'para',
    text: `（3）您的电脑软硬件和通信线路、供电线路出现故障的；`,
  },
  {
    className: 'para',
    text: `（4）因病毒（包含木马病毒等）、恶意程序攻击、网络拥堵、系统不稳定、系统或设备故障、通信障碍、电力故障、银行原因、第三方服务瑕疵或政府行为等原因。`,
  },
  {
    className: 'para',
    text: `尽管有前款约定，基骨将采取合理行动积极促使服务恢复正常。`,
  },
  {
    className: 'para',
    text: `7.11 您明确同意您使用基骨网络服务所存在的风险将完全由您承担。您理解并接受下载或通过基骨服务取得的任何信息资料取决于您，并由您承担系统受损、资料丢失以及其他任何风险。基骨对在服务网上得到的任何商品购物服务、交易进程、招聘信息，都不做担保。`,
  },
  {
    className: 'para',
    text: `7.12 基骨不能随时预见和防范法律、技术以及其他风险，包括但不限于政府行为、不可抗力、病毒（包含木马病毒等）、黑客攻击、系统不稳定、第三方服务瑕疵等原因可能导致的服务终端、数据丢失以及其他损失和风险。由此产生的损失及责任基骨不承担任何责任。`,
  },
  {
    className: 'para',
    text: `7.13 通过服务购买或获取任何产品、样品、数据、信息或进行交易等，或其他可替代上述行为的行为而产生的费用，基骨不承担任何责任；`,
  },
  {
    className: 'para',
    text: `7.14 基骨不能预见您未经授权的存取或修改数据或数据的传输，对此不承担任何责任；`,
  },
  {
    className: 'para',
    text: `7.15 您充分了解并同意，鉴于互联网体制及环境的特殊性，您在服务中分享的信息及个人资料有可能会被他人复制、转载、擅改或做其他非法用途；您在此已充分意识此类风险的存在，并确认此等风险应完全由您自行承担，基骨对此不承担任何责任。`,
  },
  {
    className: 'para',
    text: `7.16 您了解并同意，在使用服务过程中可能存在来自任何他人的包括威胁性的、诽谤性的、令人反感的或非法的内容或行为或对他人权利的侵犯（包括知识产权）及匿名或冒名的信息的风险，基于服务使用规范所述，该等风险应由您自行承担，基骨对此不承担任何责任。`,
  },
  {
    className: 'para',
    text: `7.17 将依据任何法律或合约或法定关系（例如由于雇佣关系和依据保密合约所得知或揭露之内部资料、专属及机密资料）知悉但无权传送之任何内容加以传送或分享。`,
  },
  {
    className: 'para',
    text: `7.18 将涉嫌侵害他人权利（包括但不限于著作权、专利权、商标权、商业秘密等知识产权）之内容传送或分享，基骨对此不承担任何责任。`,
  },
  {
    className: 'para',
    text: `7.19 将任何广告、推广信息、促销资料、“垃圾邮件”、“滥发信件”、“连锁信件”、“直销”或其他任何形式的劝诱资料加以传送或分享；供前述目的使用的专用区域或专用功能除外，基骨对此不承担任何责任。`,
  },
  {
    className: 'para',
    text: `7.20 您未对您的帐号资料保持安全及保密，基骨对此不承担任何责任。`,
  },
  {
    className: 'title',
    text: '八、其他',
  },
  {
    className: 'para',
    text: `8.1 本协议的订立、履行和解释及争议的解决等，均应适用中华人民共和国法律。`,
  },
  {
    className: 'para',
    text: `8.2 凡因本协议产生的或者与本协议有关的任何争议或者纠纷，双方应首先友好协商解决；协商不成的，双方约定向北京市海淀区人民法院诉讼解决。`,
  },
  {
    className: 'para',
    text: `8.3 基骨未行使或执行本服务协议任何权利或规定，不构成对前述权利或权利之放弃。`,
  },
  {
    className: 'para',
    text: `8.4 基骨于您过失或违约时放弃本协议规定的权利的，不得视为基骨对您的其他或以后同类之过失或违约行为弃权。`,
  },
  {
    className: 'para',
    text: `8.5 本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。`,
  },
  {
    className: 'para',
    text: `8.6 基骨保留不经事先通知为维护、升级或其他合理目的暂停基骨系统（网站）服务的权利。`,
  },
  {
    className: 'para',
    text: `8.7 您理解并同意，基骨有权自主决定经营策略并根据业务调整情况将本协议项下的全部权利义务一并转移给其关联公司，转让将以本协议规定的方式通知，您承诺对此不持有异议。`,
  },
  {
    className: 'title',
    text: '九、联系方式',
  },
  {
    className: 'para',
    text: `如果您对本协议有任何疑问、意见或建议，通过以下方式与我们联系：`,
  },
  {
    className: 'para',
    text: `公司名称：北京基骨智能科技有限公司`,
  },
  {
    className: 'para',
    text: `联系电话：(010) 5083 6525`,
  },
  {
    className: 'para',
    text: `联系地址：北京市海淀区中关村大街22号6层A629`,
  },
  {
    className: 'para',
    text: `联系邮箱：info@ai-align.com`,
  },
  {
    className: 'para',
    text: `最新更新时间：2022年10月31日`,
  },
];

const topNodes = [
  {
    className: 'maintitle',
    text: `《AI牙小程序隐私协议》`,
  },
  {
    className: 'para',
    text: `本隐私协议（“本协议”）仅适用于北京基骨智能科技有限公司（以下简称“基骨”）提供患者管理的AI牙小程序系统（以下简称“小程序”）。基骨将本着合法、正当和必要的原则，严格遵守适用的中国法律法规和标准明确告知用户收集和使用个人信息的规则、目的、方法和范围并获取用户相应的授权同意。`,
  },
  {
    className: 'para',
    text: `因此，在用户（即“您”）访问或使用基骨系统（小程序）提供的产品（或服务）前，请仔细阅读并充分理解本政策各条款内容，特别是以加黑加粗形式提示用户注意的条款。`,
  },
  {
    className: 'em',
    text: `本产品非医疗器械，不能用于临床。虽然本软件相关功能经过基骨内部严格的测试和检验，但仍为未获得国家批准的注册医疗器械产品，其功能的安全性和有效性并未经过有资质的第三方的检测和审评。您知晓其非医疗器械属性，并审慎地使用本软件相关功能。`,
  },
  {
    className: 'para',
    text: `只要用户点击“确认”按钮或勾选“同意”，即表示用户已充分理解并同意本政策。如用户对本政策条款或内容有任何疑问、意见或建议，烦请通过本政策底部提供的联系方式联系我们，基骨非常愿意为用户提供可行的协助。`,
  },
  {
    className: 'title',
    text: '第一部分 定义',
  },
  {
    className: 'para',
    text: `个人信息：是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。`,
  },
  {
    className: 'para',
    text: `个人敏感信息：指的是一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息。请注意，本隐私政策中提及的个人信息均包含个人敏感信息。`,
  },
  {
    className: 'title',
    text: '第二部分 隐私政策',
  },
  {
    className: 'para',
    text: `本政策将帮助用户了解以下内容：`,
  },
  {
    className: 'para',
    text: `一、基骨如何收集和使用用户的个人信息`,
  },
  {
    className: 'para',
    text: `二、基骨如何共享、转让、公开披露、存储用户的个人信息`,
  },
  {
    className: 'para',
    text: `三、基骨如何保护用户的个人信息`,
  },
  {
    className: 'para',
    text: `四、用户如何管理用户所提供的个人信息`,
  },
  {
    className: 'para',
    text: `五、本政策如何更新`,
  },
  {
    className: 'para',
    text: `六、如何联系基骨`,
  },
  {
    className: 'para',
    text: `基骨深知个人信息对用户的重要性并会尽全力保护其安全可靠。同时，基骨承诺将按业界成熟的安全标准采取相应的安全保护措施来保护用户的个人信息。请在使用我们的产品（或服务）前，仔细阅读并了解本隐私政策。`,
  },
  {
    className: 'title',
    text: `一、基骨如何收集和使用用户的个人信息`,
  },
  {
    className: 'para',
    text: `基骨仅会出于本政策所述的以下目的，收集和使用用户的个人信息：`,
  },
  {
    className: 'li',
    text: `●　用户直接提供的个人信息`,
  },
  {
    className: 'para',
    text: `我们会收集用户的姓名、性别、电话、等信息以建立用户基骨的合作身份，获取业务相关信息及进度。`,
  },
  {
    className: 'li',
    text: `●　用户间接提供的患者信息`,
  },
  {
    className: 'em',
    text: `基骨承诺不会擅自收集和使用用户上传的患者敏感信息。此类个人信息具体包括姓名、年龄、性别、出生日期、关于患者牙齿的健康信息（包括但不限于患者的牙齿和面部照片）。其中尤其需要注意的是关于患者牙齿的健康信息属于患者的个人敏感信息。用户通过软件上传患者数据的操作为用户个人行为，默认已经得到患者同意且不侵犯患者隐私。由此引起的患者隐私相关的纠纷，基骨不承担任何责任。`,
  },
  {
    className: 'title',
    text: `二、 基骨如何共享、转让、公开披露、存储用户的个人信息`,
  },
  {
    className: 'title',
    text: `共享`,
  },
  {
    className: 'para',
    text: `我们不会与基骨以外的任何公司、组织和个人共享用户的个人信息，但以下情况除外：`,
  },
  {
    className: 'li',
    text: `●　在获取明确同意的情况下共享：获得用户的明确同意后，基骨会与其他方共享用户的个人信息。`,
  },
  {
    className: 'li',
    text: `●　基骨可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享用户的个人信息。`,
  },
  {
    className: 'title',
    text: `转让`,
  },
  {
    className: 'para',
    text: `基骨不会向基骨以外的任何公司、组织和个人转让用户的个人信息，但以下情况除外：`,
  },
  {
    className: 'li',
    text: `●　在获取明确同意的情况下转让：获得用户的明确同意后，基骨会向其他方转让用户的个人信息；`,
  },
  {
    className: 'li',
    text: `●　在涉及合并、收购或破产清算时，如涉及个人信息转让，基骨会在要求新的持有用户个人信息的公司、组织继续受此隐私政策的约束；否则基骨将要求该公司、组织重新向用户征求授权同意。`,
  },
  {
    className: 'title',
    text: `公开披露`,
  },
  {
    className: 'para',
    text: `基骨仅会在以下情况下，公开披露用户的个人信息：`,
  },
  {
    className: 'li',
    text: `●　获得用户明确同意（如涉及患者个人信息，则通过用户或由基骨自行获得患者的授权同意）后；`,
  },
  {
    className: 'li',
    text: `●　基于法律的披露：在法律、法律程序或政府主管部门强制性要求的情 况下，基骨可能会公开披露用户所提供的个人信息。`,
  },
  {
    className: 'title',
    text: `储存`,
  },
  {
    className: 'li',
    text: `●　信息存储的地点： 基骨在中华人民共和国境内运营中收集和产生的个人信息，存储在中国境内，以下情形除外：`,
  },
  {
    className: 'para',
    text: `a. 法律法规有明确规定；`,
  },
  {
    className: 'para',
    text: `b. 获得用户的明确授权。`,
  },
  {
    className: 'li',
    text: `●　信息存储的时间： 基骨只会在达成本政策所述目的所需的最短期限内保留用户所提供的个人信息，除非法律有强制的存留要求。而我们判断前述期限的标准包括：`,
  },
  {
    className: 'para',
    text: `a. 完成与用户相关的服务目的、维护相应服务及业务记录、应对用户可能的查询或投诉；`,
  },
  {
    className: 'para',
    text: `b. 保证基骨为用户提供服务的安全和质量；`,
  },
  {
    className: 'para',
    text: `c. 用户是否同意更长的留存期间；`,
  },
  {
    className: 'para',
    text: `d. 是否存在保留期限的其他特别约定。`,
  },
  {
    className: 'para',
    text: `在用户所提供的个人信息超出保留期限后，基骨会根据适用法律的要求删除用户所提供的个人信息或对其进行匿名化处理。`,
  },
  {
    className: 'li',
    text: `●　停止运营：如基骨系统（小程序）决定停止运营，基骨将在相关服务停止运营后停止继续收集用户所提供的个人信息。基骨将以公告形式将停止运营通知向用户送达。对已持有的个人信息将进行删除或匿名化处理。`,
  },
  {
    className: 'title',
    text: `三、 基骨如何保护用户的个人信息`,
  },
  {
    className: 'li',
    text: `●　基骨已使用符合业界标准的安全防护措施保护用户提供的个人信息，防止数据遭到未经授权访问、公开披露、使用、修改、损坏或丢失。基骨会采取一切合理可行的措施，保护用户的个人信息。基骨同时对基骨系统（小程序）提供安全浏览方式；基骨会使用加密技术确保数据的保密性；基骨会使用受信赖的保护机制防止数据遭到恶意攻击；基骨会部署访问控制机制，确保只有授权人员才可访问个人信息；以及基骨会举办安全和隐私保护培训课程，加强员工对于保护个人信息重要性的认识。`,
  },
  {
    className: 'li',
    text: `●　基骨会采取一切合理可行的措施，确保未收集无关的个人信息。基骨只会在达成本政策所述目的所需的期限内保留用户的个人信息，除非需要延长保留期或受到法律的允许。`,
  },
  {
    className: 'li',
    text: `●　在不幸发生个人信息安全事件后，基骨将按照法律法规的要求及时向用户告知：安全事件的基本情况和可能的影响、基骨已采取或将要采取的处置措施、用户可自主防范和降低风险的建议、对用户的补救措施等。我们将及时将事件相关情况以邮件、信函、电话、推送通知等方式告知用户，难以逐一告知个人信息主体时，基骨会采取合理、有效的方式发布公告。同时，基骨还将按照法律法规要求上报个人信息安全事件的处置情况。`,
  },
  {
    className: 'title',
    text: `四、用户如何管理用户所提供的个人信息`,
  },
  {
    className: 'para',
    text: `按照中国相关的法律、法规、标准，以及其他国家、地区的通行做法，基骨保障用户对自己的个人信息行使以下权利：`,
  },
  {
    className: 'li',
    text: `●　删除用户所提供的个人信息`,
  },
  {
    className: 'para',
    text: `在以下情形中，用户可以向我们提出删除个人信息的请求：`,
  },
  {
    className: 'para',
    text: `a. 如果基骨处理个人信息的行为违反法律法规；`,
  },
  {
    className: 'para',
    text: `b. 如果基骨未征得用户的同意收集或使用了个人信息；`,
  },
  {
    className: 'para',
    text: `c. 如果基骨处理个人信息的行为违反了与用户的约定；`,
  },
  {
    className: 'para',
    text: `d. 如果用户不再使用基骨的产品或服务，或用户注销了账号；`,
  },
  {
    className: 'para',
    text: `e. 如果基骨不再为用户提供产品或服务。`,
  },
  {
    className: 'para',
    text: `若基骨决定响应用户的删除请求，基骨还将同时通知从我们获得用户的个人信息的实体，要求其及时删除，除非法律法规另有规定，或这些实体获得用户的独立授权。 请注意，当用户从基骨的服务中删除信息或基骨收到并同意用户的删除申请后，基骨可能不会立即从备份系统中删除相应的信息，但会在备份更新时删除这些信息。`,
  },
  {
    className: 'li',
    text: `●　改变用户授权同意的范围`,
  },
  {
    className: 'para',
    text: `每个业务功能需要一些基本的个人信息才能得以完成（见本政策“一、 我们如何收集和使用用户所提供的个人信息”）。对于额外收集的个人信息的收集和使用，用户可以随时提供或撤回用户的授权同意，或代表患者提供或撤回授权同意。当用户终止授权同意后，基骨将不再收集和使用相应的个人信息。但用户终止授权同意的决定，不会影响此前基于用户的授权而开展的个人信息处理。`,
  },
  {
    className: 'title',
    text: `五、本政策如何更新`,
  },
  {
    className: 'para',
    text: `基骨保留不经事先通知为维护、升级或其他合理目的修改、更新本政策的权利，请用户定期查阅更新。本政策的相关修改权、更新权及最终解释权均属基骨所有。`,
  },
  {
    className: 'para',
    text: `未经用户明确同意，我们不会削减用户按照本政策所应享有的权利。基骨会在本页面上发布对本政策所做的任何变更。对于重大变更，基骨还会发布更为显著的通知，说明隐私政策的具体变更内容。`,
  },
  {
    className: 'para',
    text: `本政策所指的重大变更包括但不限于：`,
  },
  {
    className: 'li',
    text: `●　基骨的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；`,
  },
  {
    className: 'li',
    text: `●　基骨在所有权结构、组织架构等方面发生重大变化。如业务调整、破产并购等引起的所有者变更等；`,
  },
  {
    className: 'li',
    text: `●　个人信息共享、转让或公开披露的主要对象发生变化；`,
  },
  {
    className: 'li',
    text: `●　用户参与个人信息处理方面的权利及其行使方式发生重大变化；`,
  },
  {
    className: 'li',
    text: `●　基骨负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化时；`,
  },
  {
    className: 'li',
    text: `●　个人信息安全影响评估报告表明存在高风险时。`,
  },
  {
    className: 'para',
    text: `如在任何变动发布后，用户继续访问基骨系统（小程序）以及通过各种方式使用基骨系统（小程序）、接收基骨系统（小程序）服务的行为，即表示用户已详细阅读并了解本政策，将被视为对本政策全部内容的无异议认可且同意基骨所做的相关变更。基骨还会将本政策的旧版本存档，供用户查阅。`,
  },
  {
    className: 'title',
    text: `六、如何联系基骨`,
  },
  {
    className: 'para',
    text: `如果用户对本隐私政策有任何疑问、意见或建议，通过以下方式与我们联系：`,
  },
  {
    className: 'para',
    text: `公司名称：北京基骨智能科技有限公司`,
  },
  {
    className: 'para',
    text: `联系电话：(010) 5083 6525`,
  },
  {
    className: 'para',
    text: `联系地址：北京市海淀区中关村大街22号6层A629`,
  },
  {
    className: 'para',
    text: `联系邮箱：info@ai-align.com`,
  },
  {
    className: 'para',
    text: `最新更新时间：2022年10月31日`,
  },
];

const aboutNodes = [
  {
    className: 'maintitle',
    text: `《公司简介》`,
  },
  {
    className: 'para',
    text: `北京基骨智能科技公司致力于用人工智能、大数据等先进技术来解决口腔临床痛点，提供高效、便捷、智能的数字化诊疗解决方案和产品。`,
  },
];

const tou = <any>[];
const top = <any>[];
const about = <any>[];

const setStyles = (className) => {
  switch (className) {
    case 'maintitle': return `font-size: 16px; text-align: center; font-weight: bold;`;
    case 'title': return `margin-top: .75em; font-weight: bold;`;
    case 'para': return `margin-top: .75em; line-height: 1.5;`;
    case 'paraindent': return `margin-top: .75em; line-height: 1.5; text-indent: 1em;`;
    case 'em': return `margin-top: .75em; line-height: 1.5; color: red; font-weight: bold;`;
    case 'bold': return `margin-top: .75em; line-height: 1.5; font-weight: bold;`;
    case 'li': return `margin-top: .75em; line-height: 1.5; list-style-type: disc;`;
  }
}

const buildRichTextNodes = (plainNodes, output) => {
  plainNodes.forEach((item) => {
    if (item.text) {
      output.push({
        name: 'div',
        attrs: {
          style: setStyles(item.className),
        },
        children: [{
          type: 'text',
          text: item.text,
        }],
      });
    }
  });
};

buildRichTextNodes(touNodes, tou);
buildRichTextNodes(topNodes, top);
buildRichTextNodes(aboutNodes, about);

export const TermOfUser = tou;
export const TermOfPrivacy = top;
export const About = about;
