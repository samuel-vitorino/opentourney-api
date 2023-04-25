locals {
  env = "dev"
}

provider "google" {
  project = "${var.project}"
}

module "dev-vpc" {
  source  = "../../modules/vpc"
  project = "${var.project}"
  env     = "${local.env}"
}

module "dev-api" {
  source  = "../../modules/api"
  project = "${var.project}"
  subnet  = "${module.dev-vpc.subnet}"
}

module "dev-firewall" {
  source  = "../../modules/firewall"
  project = "${var.project}"
  subnet  = "${module.dev-vpc.subnet}"
}