import {
  createMongoAbility,
  AbilityBuilder,
  MongoAbility,
  AbilityClass,
} from "@casl/ability";
import UserTypes from "../utils/userTypes"; // pastikan ini sesuai

type Actions = "manage" | "create" | "read" | "update" | "delete" | "view";
type Subjects =
  | "Product"
  | "Order"
  | "User"
  | "Cart"
  | "DeliveryAddress"
  | "Invoice"
  | "all";

export type AppAbility = MongoAbility<[Actions, Subjects], Record<string, any>>;
const AppAbilityClass =
  createMongoAbility as unknown as AbilityClass<AppAbility>;

export function createAppAbility() {
  return new AppAbilityClass([]);
}

const definePoliciesFor = {
  guest(user: UserTypes, builder: AbilityBuilder<AppAbility>) {
    const { can } = builder;
    can("read", "Product");
  },

  user(user: UserTypes, builder: AbilityBuilder<AppAbility>) {
    const { can } = builder;
    const userId = user._id?.toString(); // ensure string for Mongo queries

    can("create", "Product", { user_id: userId });
    can("read", "Product", { user_id: userId });
    can("update", "Product", { user_id: userId });
    can("delete", "Product", { user_id: userId });
    can("view", "Order");
    can("create", "Order");
    can("read", "Order", { user_id: userId });
    can("update", "User", { _id: userId });
    can("read", "Cart", { user_id: userId });
    can("update", "Cart", { user_id: userId });
    can("view", "DeliveryAddress");
    can("create", "DeliveryAddress", { user_id: userId });
    can("read", "DeliveryAddress", { user_id: userId });
    can("update", "DeliveryAddress", { user_id: userId });
    can("delete", "DeliveryAddress", { user_id: userId });
    can("read", "Invoice", { user_id: userId });
  },

  admin(user: UserTypes, builder: AbilityBuilder<AppAbility>) {
    const { can } = builder;
    can("manage", "all"); // Full access
  },
};

export function policyFor(user: UserTypes): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(AppAbilityClass);

  const role = user?.role ?? "guest";
  const definePolicy = definePoliciesFor[role] ?? definePoliciesFor.guest;

  definePolicy(user, builder);

  return new AppAbilityClass(builder.rules);
}
