export type AmcBrand={name:string;logo:string};

const brands:Array<AmcBrand&{prefixes:string[]}>= [
 {name:'360 ONE Mutual Fund',logo:'360_ONE_Mutual_Fund.png',prefixes:['360 one']},
 {name:'Abakkus Mutual Fund',logo:'Abakkus_Mutual_Fund.png',prefixes:['abakkus']},
 {name:'Aditya Birla Sun Life Mutual Fund',logo:'Aditya_Birla_Sun_Life_Mutual_Fund.png',prefixes:['aditya birla sun life']},
 {name:'Axis Mutual Fund',logo:'Axis_Mutual_Fund.svg',prefixes:['axis']},
 {name:'Bajaj Finserv Mutual Fund',logo:'Bajaj_Finserv_Mutual_Fund.svg',prefixes:['bajaj finserv']},
 {name:'Bandhan Mutual Fund',logo:'Bandhan_Mutual_Fund.svg',prefixes:['bandhan']},
 {name:'DSP Mutual Fund',logo:'DSP_Mutual_Fund.svg',prefixes:['dsp']},
 {name:'Edelweiss Mutual Fund',logo:'Edelweiss_Mutual_Fund.svg',prefixes:['edelweiss']},
 {name:'Franklin Templeton Mutual Fund',logo:'Franklin_Templeton_Mutual_Fund.svg',prefixes:['franklin']},
 {name:'HDFC Mutual Fund',logo:'HDFC_Mutual_Fund.svg',prefixes:['hdfc']},
 {name:'Helios Mutual Fund',logo:'Helios_Mutual_Fund.svg',prefixes:['helios']},
 {name:'ICICI Prudential Mutual Fund',logo:'ICICI_Prudential_Mutual_Fund.png',prefixes:['icici prudential']},
 {name:'Invesco Mutual Fund',logo:'Invesco_Mutual_Fund.svg',prefixes:['invesco']},
 {name:'Kotak Mahindra Mutual Fund',logo:'Kotak_Mahindra_Mutual_Fund.svg',prefixes:['kotak']},
 {name:'Mirae Asset Mutual Fund',logo:'Mirae_Asset_Mutual_Fund.svg',prefixes:['mirae asset']},
 {name:'Nippon India Mutual Fund',logo:'Nippon_India_Mutual_Fund.png',prefixes:['nippon india']},
 {name:'SBI Mutual Fund',logo:'SBI_Mutual_Fund.svg',prefixes:['sbi']},
 {name:'Tata Mutual Fund',logo:'Tata_Mutual_Fund.svg',prefixes:['tata']},
 {name:'UTI Mutual Fund',logo:'UTI_Mutual_Fund.svg',prefixes:['uti -','uti ']},
 {name:'WhiteOak Capital Mutual Fund',logo:'WhiteOak_Capital_Mutual_Fund.svg',prefixes:['whiteoak capital']},
];

export function amcBrandForScheme(schemeName:string):AmcBrand|null{
 const normalized=schemeName.trim().toLowerCase();
 const brand=brands.find(item=>item.prefixes.some(prefix=>normalized.startsWith(prefix)));
 return brand?{name:brand.name,logo:brand.logo}:null;
}

export function amcLogoPath(logo:string){
 return `${process.env.NEXT_PUBLIC_BASE_PATH||''}/amc-logos/${logo}`;
}
