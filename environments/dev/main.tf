locals {
  env = "dev"
}

provider "google" {
  project = "${var.project}"
}

module "api-dev-vpc" {
  source  = "../../modules/vpc"
  project = "${var.project}"
  env     = "${local.env}"
}

module "api-dev-api" {
  source  = "../../modules/api"
  project = "${var.project}"
  subnet  = "${module.dev-vpc.subnet}"
}

module "api-dev-firewall" {
  source  = "../../modules/firewall"
  project = "${var.project}"
  subnet  = "${module.dev-vpc.subnet}"
}