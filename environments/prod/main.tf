locals {
  env = "prod"
}

provider "google" {
  project = "${var.project}"
}

module "prod-vpc" {
  source  = "../../modules/vpc"
  project = "${var.project}"
  env     = "${local.env}"
}

module "prod-api" {
  source  = "../../modules/api"
  project = "${var.project}"
  subnet  = "${module.prod-vpc.subnet}"
}

module "prod-firewall" {
  source  = "../../modules/firewall"
  project = "${var.project}"
  subnet  = "${module.prod-vpc.subnet}"
}