locals {
  env = "prod"
}

provider "google" {
  project = "${var.project}"
}

module "api-prod-vpc" {
  source  = "../../modules/vpc"
  project = "${var.project}"
  env     = "${local.env}"
}

module "api-prod-server" {
  source  = "../../modules/api"
  project = "${var.project}"
  subnet  = "${module.prod-vpc.subnet}"
}

module "api-prod-firewall" {
  source  = "../../modules/firewall"
  project = "${var.project}"
  subnet  = "${module.prod-vpc.subnet}"
}