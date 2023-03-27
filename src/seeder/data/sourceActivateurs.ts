export type BoundedBy ={
  Box: {
    coordinates: string
  }
}

type Quantity = 'inf_5_t' | '5_a_10_t' | '11_a_20_t' | '21_a_30_t' | '31_a_52_t' | 'ne_sait_pas'

type SiteType = 'autre_dechets_verts' | 'autre_etablissement' | 'autre_partage' | 'EHPAD' | 'etab_touristique' | 'ferme' | 'milieu_hospitalier' | 'ne sait pas' | null | 'pied_immeuble' | 'plateforme_communale' | 'quartier' | 'resto_administratif' | 'resto_entreprise' | 'scolaire' | 'vermicompostage'
type ContributorAmount = number | `${number} ${'F' | 'f'}Foyers` | '' | '/' | '?' | '20 à 30 foyers' | '25 foyers / 240' | '270 apporteurs de biodéchets (mars 2022)'| '30+'| '40-50'| '40foyers' | '40 max'| '45 environ'| '45 - variable'| '5/6 Foyers' |'cantine scolaire' | 'Entre 10 et 20 foyers par semaine' | 'Inconnu' | 'nb de participants : 120' | 'nb de participants : 50' | 'Nombre de foyers participants : 80\nAutonomie en broyat : Oui' | 'Non connu' | 'Une dizaine'

export type SiteCompostage ={
  boundedBy?: {
    Box: {
      coordinates: string
    }
  }
  geometry?: {
    Point: {
      coordinates: string
    }
  }
  id_site: number
  libelle: string
  type: SiteType
  adresse: string
  ville: string
  code_postal: number
  is_public: 'oui' | 'non' | 'ne sait pas' | 'ne_sait_pas'
  is_signataire_charte: string
  quantite_traitee: Quantity
  nb_contributeurs: ContributorAmount
  nb_repas_annuel: number | '' | '?' | 'cantine scolaire également' | 'Environ 400' | 'Inconnu' | 'Non connu'
  type_materiel: string // TODO: clarify this complexity
  exploitant_nom: string // sometimes prefixed with "Référent(s): "
  exploitant_structure: string
  exploitant_contact: string // "email / phone" | "Name phone" | "email / phone" | string
  contact_referent: string // same mess as exploitant_contact
  acteur: string // also a mess
  /** YYYY-MM-DD */
  date_maj_fiche: string
  date_mise_en_route: string
  photo: string
  condition_acces: string
  fonctionnement_site: string
  nom_dept: string
  code_dept: string | number
  nom_reg: string
  code_reg: number
}
