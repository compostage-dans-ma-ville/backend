export type BoundedBy ={
  Box: {
    coordinates: string
  }
}

export type BoundedBy3 ={
  Box: {
    coordinates: string
  }
}

export type SiteCompostage2 ={
  boundedBy: any
  geometry: any
  id_site: any
  libelle: any
  type: any
  adresse: any
  ville: any
  code_postal: any
  is_public: any
  is_signataire_charte: any
  quantite_traitee: any
  nb_contributeurs: any
  nb_repas_annuel: any
  type_materiel: any
  exploitant_nom: any
  exploitant_structure: any
  exploitant_contact: any
  contact_referent: any
  acteur: any
  date_maj_fiche: any
  date_mise_en_route: any
  photo: any
  condition_acces: any
  fonctionnement_site: any
  nom_dept: any
  code_dept: any
  nom_reg?: string
  code_reg: any
}

export type FeatureMember2 ={
  v_site_compostage_dept_3857: SiteCompostage2
}

export type FeatureCollection2 ={
  boundedBy: BoundedBy3
  featureMember: FeatureMember2[]
}

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
  id_site?: number
  libelle?: string
  type?: string
  adresse?: string
  ville: string
  code_postal: number
  is_public?: 'oui' | 'non'
  is_signataire_charte?: string
  quantite_traitee?: 'ne_sait_pas'
  nb_contributeurs: string
  nb_repas_annuel: string
  type_materiel?: string
  exploitant_nom?: string
  exploitant_structure?: string
  exploitant_contact: string
  contact_referent: string
  acteur?: string
  date_maj_fiche?: string
  date_mise_en_route: string
  photo?: string
  condition_acces?: string
  fonctionnement_site?: string
  nom_dept?: string
  code_dept: number
  nom_reg?: string
  code_reg: number
  FeatureCollection?: FeatureCollection2
}

export type FeatureMember = {
  v_site_compostage_dept_3857: SiteCompostage
}

export type Root ={
  FeatureCollection: {
    boundedBy: BoundedBy
    featureMember: FeatureMember[]
  }
}
